export async function recognizeText(imageBase64: string, apiKey: string, folderId: string): Promise<string> {
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
            "x-folder-id": folderId.trim(),
            "x-data-logging-enabled": "true",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Ошибка распознования: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    return data.result?.textAnnotation?.fullText || "";
}

export async function translateText(
    text: string,
    targetLang: string,
    apiKey: string,
    folderId: string,
): Promise<string> {
    const body = {
        sourceLanguageCode: "en",
        targetLanguageCode: targetLang,
        format: "PLAIN_TEXT",
        texts: [text],
        folderId: folderId.trim(),
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
        throw new Error(`Ошибка перевода: ${response.status} ${await response.text()}`);
    }
    const data = await response.json();
    return data?.translations[0]?.text || "";
}
