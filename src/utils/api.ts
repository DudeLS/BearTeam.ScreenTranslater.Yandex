export async function recognizeText(imageBase64: string, apiKey: string): Promise<string> {
    // Убираем префикс data:image/png;base64,
    const base64Data = imageBase64.split(",")[1];

    const body = {
        mimeType: "PNG",
        languageCodes: ["ru", "en"],
        model: "page",
        content: base64Data,
    };

    const response = await fetch("https://ai.api.cloud.yandex.net/ocr/v1/recognizeText", {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${apiKey}`,
            "Content-Type": "application/json",
            "x-folder-id": YANDEX_FOLDER_ID,
            "x-data-logging-enabled": "true",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`OCR ошибка: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    console.log(data);

    return data.result?.textAnnotation?.fullText || "";

    // return extractTextFromOCR(data);
}

function extractTextFromOCR(data: any): string {
    const pages = data.results?.[0]?.text_detection?.pages || [];
    const lines: string[] = [];
    for (const page of pages) {
        for (const block of page.blocks || []) {
            for (const line of block.lines || []) {
                lines.push(line.text);
            }
        }
    }
    return lines.join("\n");
}

export async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
    console.log("text", text);
    const body = {
        sourceLanguageCode: "en",
        targetLanguageCode: targetLang,
        format: "PLAIN_TEXT",
        texts: [text],
        folderId: YANDEX_FOLDER_ID,
    };
    const response = await fetch("https://translate.api.cloud.yandex.net/translate/v2/translate", {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(`Translate ошибка: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data?.translations[0]?.text || "";
    return data.text?.[0] || "";
}
