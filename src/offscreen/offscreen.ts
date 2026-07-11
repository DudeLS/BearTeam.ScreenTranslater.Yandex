// src/offscreen/offscreen.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CROP_IMAGE") {
        const { dataUrl, x, y, width, height } = message.payload;
        try {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
                const croppedDataUrl = canvas.toDataURL("image/png");
                sendResponse({ croppedDataUrl });
            };
            img.onerror = () => {
                sendResponse({ error: "Не удалось загрузить изображение" });
            };
            img.src = dataUrl;
        } catch (err) {
            sendResponse({ error: String(err) });
        }
        return true; // важно: возвращаем true, так как ответ асинхронный
    }
});
