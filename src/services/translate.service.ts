import { HttpError } from "../errors/http.errors";
import { HTTP_STATUS } from "../enums/http.enums";
import { YandexService } from "./yandex.service";
import { TranslateTextParams, TranslateTextResult } from "../types/translate.types";

export const DEFAULT_TRANSLATE_TEXT_URL = "https://translate.api.cloud.yandex.net/translate/v2/translate";

/**
 * Сервис перевода данных
 */
export class TranslateService extends YandexService {
    private translateTextUrl: string;
    /**
     * Сервис перевода данных
     * @param {Object} cfg - Конфигурация сервиса
     * @param {string} cfg.apiKey - API-ключ для работы с Яндекс.Облаком
     * @param {string} cfg.folderId - Идентификатор каталога сервисного аккаунта
     * @param {string} [cfg.translateTextUrl] - URL эндпоинта перевода текста (опционально)
     */
    constructor(cfg: { apiKey: string; folderId: string; translateTextUrl?: string }) {
        super(cfg);
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
            this.validateBaseParams();
            if (params.targetLang?.length == 0) {
                throw new HttpError("Отсутствует код языка перевода", HTTP_STATUS.BAD_REQUEST);
            }
            if (params.sourceLang?.length == 0) {
                throw new HttpError("Отсутствует код языка оригинала", HTTP_STATUS.BAD_REQUEST);
            }
            if (params.texts?.length == 0) {
                throw new HttpError("Отсутствует массив строк для перевода", HTTP_STATUS.BAD_REQUEST);
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
                return this.handleUnSuccessResponse(response);
            }

            const data: TranslateTextData = await response.json();
            const translations = data.translations?.map((item) => item.text ?? "") ?? [];

            return { success: true, status: status, translations: translations };
        } catch (error: unknown) {
            clearTimeout(timeout);
            return this.handleExceptionResponse(error, status);
        }
    }
}

type TranslateTextData = {
    translations?: {
        text?: string;
    }[];
};
