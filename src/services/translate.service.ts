import { ERROR_NAME } from "../constants/error.constants";
import { HTTP_STATUS } from "../enums/http.enums";
import { TranslateTextParams, TranslateTextResult } from "../types/translate.types";

export const DEFAULT_TRANSLATE_TEXT_URL = "https://translate.api.cloud.yandex.net/translate/v2/translate";

/**
 * Сервис перевода данных
 */
export class TranslateService {
    private apiKey: string;
    private folderId: string;
    private translateTextUrl: string;
    /**
     * Сервис перевода данных
     * @param {Object} cfg - Конфигурация сервиса
     * @param {string} cfg.apiKey - API-ключ для работы с Яндекс.Облаком
     * @param {string} cfg.folderId - Идентификатор каталога сервисного аккаунта
     * @param {string} [cfg.translateTextUrl] - URL эндпоинта перевода текста (опционально)
     */
    constructor(cfg: { apiKey: string; folderId: string; translateTextUrl?: string }) {
        this.apiKey = cfg.apiKey.trim();
        this.folderId = cfg.folderId.trim();
        this.translateTextUrl = cfg.translateTextUrl?.trim() ?? DEFAULT_TRANSLATE_TEXT_URL;
    }
    /**
     * Перевести текст с помощью Yandex Translate API
     * @param {TranslateTextParams} params параметры запроса на перевод текста
     * @returns {Promise<TranslateTextResult>} объект с результатом или ошибкой
     */
    public async translateText(params: TranslateTextParams): Promise<TranslateTextResult> {
        let status = HTTP_STATUS.BEFORE_REQUEST;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
            if (this.apiKey?.length == 0) {
                return {
                    success: false,
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: "Отсутствует API-ключ для работы с Яндекс.Облаком",
                };
            }
            if (this.folderId?.length == 0) {
                return {
                    success: false,
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: "Отсутствует идентификатор каталога сервисного аккаунта",
                };
            }
            if (params.texts?.length == 0) {
                return {
                    success: false,
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: "Отсутствует массив строк для перевода",
                };
            }
            if (params.sourceLang?.length == 0) {
                return { success: false, status: HTTP_STATUS.BAD_REQUEST, message: "Отсутствует код языка оригинала" };
            }
            if (params.targetLang?.length == 0) {
                return { success: false, status: HTTP_STATUS.BAD_REQUEST, message: "Отсутствует код языка перевода" };
            }
            const response = await fetch(this.translateTextUrl, {
                method: "POST",
                headers: {
                    Authorization: `Api-Key ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    texts: params.texts,
                    format: params.format || "PLAIN_TEXT",
                    folderId: this.folderId,
                    sourceLanguageCode: params.sourceLang,
                    targetLanguageCode: params.targetLang,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeout);
            status = response.status;

            if (!response.ok) {
                const text = await response.text();
                try {
                    const error: TranslateTextError = JSON.parse(text);
                    return { success: false, status: status, message: error.message };
                } catch {
                    return { success: false, status: status, message: text };
                }
            }

            const data: TranslateTextData = await response.json();
            const translations = data.translations?.map((item) => item.text ?? "") ?? [];

            return { success: true, status: status, translations: translations };
        } catch (error: any) {
            clearTimeout(timeout);
            if (error.name === ERROR_NAME.ABORT) {
                return { success: false, status: HTTP_STATUS.REQUEST_TIMEOUT, message: "Превышено время ожидания" };
            } else {
                return { success: false, status: status, message: String(error) };
            }
        }
    }
}

type TranslateTextData = {
    translations?: {
        text?: string;
    }[];
};

type TranslateTextError = {
    code: number;
    message: string;
};
