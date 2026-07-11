import { recognizeText, translateText } from "../utils/api";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "AREA_SELECTED") {
        const { x, y, width, height } = message.payload;
        captureAndProcess(x, y, width, height);
    }
});

async function captureAndProcess(x: number, y: number, width: number, height: number) {
    try {
        const dataUrl = await new Promise<string>((resolve) => {
            chrome.tabs.captureVisibleTab({ format: "png" }, (url) => resolve(url));
        });

        // Убедимся, что offscreen-документ создан
        await createOffscreenDocumentIfNeeded();

        let croppedDataUrl: string;
        try {
            croppedDataUrl = await cropImageOffscreen(dataUrl, x, y, width, height);
        } catch (err) {
            // Если ошибка связана с отсутствием offscreen, пробуем создать его заново и повторить
            if (err instanceof Error && err.message.includes("Offscreen document not available")) {
                offscreenCreated = false;
                await createOffscreenDocumentIfNeeded();
                croppedDataUrl = await cropImageOffscreen(dataUrl, x, y, width, height);
            } else {
                throw err;
            }
        }

        const recognizedText = await recognizeText(croppedDataUrl, YANDEX_API_KEY);

        const { targetLang } = await new Promise<{ targetLang?: string }>((resolve) => {
            chrome.storage.local.get(["targetLang"], resolve);
        });

        const translated = await translateText(recognizedText, targetLang || "en", YANDEX_API_KEY);

        chrome.storage.local.set({ result: translated, loading: false });
    } catch (error) {
        console.error("Ошибка в captureAndProcess:", error);
        chrome.storage.local.set({ result: "Ошибка: " + String(error), loading: false });
    }
}

let offscreenCreated = false;

async function createOffscreenDocumentIfNeeded() {
    if (offscreenCreated) return;
    try {
        await chrome.offscreen.createDocument({
            url: chrome.runtime.getURL("offscreen.html"),
            reasons: ["WORKERS"],
            justification: "Для обрезки изображения",
        });
        offscreenCreated = true;
    } catch (err) {
        // Если ошибка "Only a single offscreen document", значит документ уже есть
        if (
            err &&
            typeof err === "object" &&
            "message" in err &&
            typeof err.message === "string" &&
            err.message.includes("Only a single offscreen document")
        ) {
            offscreenCreated = true;
            console.log("Offscreen document already exists, reusing.");
            return;
        }
        console.error("Не удалось создать offscreen-документ:", err);
        offscreenCreated = false;
        throw err;
    }
}

function cropImageOffscreen(dataUrl: string, x: number, y: number, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Таймаут ожидания ответа от offscreen-документа"));
        }, 10000);

        chrome.runtime.sendMessage(
            {
                type: "CROP_IMAGE",
                payload: { dataUrl, x, y, width, height },
            },
            (response) => {
                clearTimeout(timeout);
                if (chrome.runtime.lastError) {
                    // Если соединение с offscreen потеряно, сообщаем об этом наверх
                    if (
                        chrome.runtime.lastError.message &&
                        chrome.runtime.lastError.message.includes("Could not establish connection")
                    ) {
                        offscreenCreated = false;
                        reject(new Error("Offscreen document not available"));
                    } else {
                        reject(chrome.runtime.lastError);
                    }
                } else if (response && response.croppedDataUrl) {
                    resolve(response.croppedDataUrl);
                } else {
                    reject(new Error("Не удалось обрезать изображение"));
                }
            },
        );
    });
}
