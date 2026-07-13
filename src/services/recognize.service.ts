/**
 * Сервис распознования данных
 */
export class RecognizeService {
    private apiKey: string;
    private folderId: string;
    /**
     * Сервис распознования данных
     * @param apiKey API-ключ для работы с Vision OCR
     * @param folderId Идентификатор каталога сервисного аккаунта
     */
    constructor(apiKey: string, folderId: string) {
        this.apiKey = apiKey.trim();
        this.folderId = folderId.trim();
    }
    /**
     * Распознать текст
     * @param image Изображение (Base64)
     * @param format Формат изображения
     * @param langs Список языков для распознавания
     * @returns Распознанный текст
     */
    public async recognizeText(image: string, format: string, langs: string[]): Promise<string> {
        const content = image.startsWith("data:") ? image.split(",")[1] : image;

        const response = await fetch("https://ai.api.cloud.yandex.net/ocr/v1/recognizeText", {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${this.apiKey}`,
                "Content-Type": "application/json",
                "x-folder-id": this.folderId,
                "x-data-logging-enabled": "true",
            },
            body: JSON.stringify({
                mimeType: format,
                languageCodes: langs,
                model: "page",
                content: content,
            }),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Ошибка распознавания (${response.status}): ${message}`);
        }

        const data: RecognizeTextData = await response.json();
        return data.result?.textAnnotation?.fullText || "";
    }
}

type RecognizeTextData = {
    result?: {
        textAnnotation?: {
            fullText?: string;
        };
    };
};
