/**
 * Сервис перевода данных
 */
export class TranslateService {
    private apiKey: string;
    private folderId: string;
    /**
     * Сервис перевода данных
     * @param apiKey API-ключ для работы
     * @param folderId Идентификатор каталога сервисного аккаунта
     */
    constructor(apiKey: string, folderId: string) {
        this.apiKey = apiKey.trim();
        this.folderId = folderId.trim();
    }
    /**
     * Перевести текст
     * @param texts Текст для перевода
     * @param sourceLang Язык, с которого переводится текст
     * @param targetLang Язык, на который переводится текст
     * @returns Переведенный текст
     */
    async translateText(texts: string[], sourceLang: string, targetLang: string): Promise<string> {
        const response = await fetch("https://translate.api.cloud.yandex.net/translate/v2/translate", {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sourceLanguageCode: sourceLang,
                targetLanguageCode: targetLang,
                format: "PLAIN_TEXT",
                texts: texts,
                folderId: this.folderId,
            }),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Ошибка перевода (${response.status}): ${message}`);
        }

        const data: TranslateTextData = await response.json();
        const array = data.translations?.map((item) => item.text ?? "") ?? [];

        return array.join(" ");
    }
}

type TranslateTextData = {
    translations?: {
        text?: string;
    }[];
};
