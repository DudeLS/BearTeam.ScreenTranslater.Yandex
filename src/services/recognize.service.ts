import { HttpError } from "../errors/http.errors";
import { HTTP_STATUS } from "../enums/http.enums";
import { YandexService } from "./yandex.service";
import { RecognizeTextParams, RecognizeTextResult } from "../types/recognize.types";

export const DEFAULT_RECOGNIZE_TEXT_URL = "https://ai.api.cloud.yandex.net/ocr/v1/recognizeText";

/**
 * Сервис распознования данных
 */
export class RecognizeService extends YandexService {
    private recognizeTextUrl: string;
    /**
     * Сервис перевода данных
     * @param {Object} cfg - Конфигурация сервиса
     * @param {string} cfg.apiKey - API-ключ для работы с Яндекс.Облаком
     * @param {string} cfg.folderId - Идентификатор каталога сервисного аккаунта
     * @param {string} [cfg.recognizeTextUrl] - URL эндпоинта распознования текста (опционально)
     */
    constructor(cfg: { apiKey: string; folderId: string; recognizeTextUrl?: string }) {
        super(cfg);
        this.recognizeTextUrl = cfg.recognizeTextUrl?.trim() ?? DEFAULT_RECOGNIZE_TEXT_URL;
    }
    /**
     * Распознать текст с помощью Yandex OCR API
     * @param {RecognizeTextParams} params параметры запроса на распознование текста
     * @returns {Promise<RecognizeTextResult>} объект с результатом или ошибкой
     */
    public async recognizeText(params: RecognizeTextParams): Promise<RecognizeTextResult> {
        let status = HTTP_STATUS.BEFORE_REQUEST;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
            this.validateBaseParams();
            if (params.image?.length == 0) {
                throw new HttpError("Отсутствует изображение", HTTP_STATUS.BAD_REQUEST);
            }
            if (params.format?.length == 0) {
                throw new HttpError("Отсутствует формат изображения", HTTP_STATUS.BAD_REQUEST);
            }
            if (params.langs?.length == 0) {
                throw new HttpError("Отсутствует список кодов языков для распознавания", HTTP_STATUS.BAD_REQUEST);
            }

            const content = params.image.startsWith("data:") ? params.image.split(",")[1] : params.image;

            const response = await fetch(this.recognizeTextUrl, {
                method: "POST",
                headers: {
                    Authorization: `Api-Key ${this.apiKey}`,
                    "Content-Type": "application/json",
                    "x-folder-id": this.folderId,
                    "x-data-logging-enabled": "true",
                },
                body: JSON.stringify({
                    mimeType: params.format,
                    languageCodes: params.langs,
                    model: params.model || "page",
                    content: content,
                }),
            });

            clearTimeout(timeout);
            status = response.status;

            if (!response.ok) {
                return this.handleUnSuccessResponse(response);
            }

            const data: RecognizeTextData = await response.json();
            const fullText = data.result?.textAnnotation?.fullText || "";

            return { success: true, status: status, recognition: fullText };
        } catch (error: unknown) {
            clearTimeout(timeout);
            return this.handleExceptionResponse(error, status);
        }
    }
}

type RecognizeTextData = {
    result?: {
        textAnnotation?: {
            fullText?: string;
        };
    };
};
