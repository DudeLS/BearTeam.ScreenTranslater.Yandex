import { HttpError } from "../errors/http.errors";
import { ERROR_NAME } from "../constants/error.constants";
import { HTTP_STATUS } from "../enums/http.enums";
import { ActionResult, RequestErrorResult } from "../types/yandex.types";

/**
 * Базовый сервис Yandex
 */
export class YandexService {
    protected apiKey: string;
    protected folderId: string;
    /**
     * Базовый сервис Yandex
     * @param {Object} cfg - Конфигурация сервиса
     * @param {string} cfg.apiKey - API-ключ для работы с Яндекс.Облаком
     * @param {string} cfg.folderId - Идентификатор каталога сервисного аккаунта
     */
    constructor(cfg: { apiKey: string; folderId: string }) {
        this.apiKey = cfg.apiKey.trim();
        this.folderId = cfg.folderId.trim();
    }
    /**
     * Проверить базовые параметры
     */
    protected validateBaseParams() {
        if (this.apiKey?.length == 0) {
            throw new HttpError("Отсутствует API-ключ для работы с Яндекс.Облаком", HTTP_STATUS.BAD_REQUEST);
        }
        if (this.folderId?.length == 0) {
            throw new HttpError("Отсутствует идентификатор каталога сервисного аккаунта", HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Обработать неуспешный ответ
     * @param response HTTP ответ
     * @returns {Promise<TResult>} объект с ошибкой
     */
    protected async handleUnSuccessResponse<TResult extends ActionResult>(response: Response): Promise<TResult> {
        const text = await response.text();
        try {
            const error: RequestErrorResult = JSON.parse(text);
            return { success: false, status: response.status, message: error.message } as TResult;
        } catch {
            return { success: false, status: response.status, message: text } as TResult;
        }
    }
    /**
     * Обработать ошибку
     * @param error Ошибка
     * @param status Статус
     * @returns Объект с ошибкой
     */
    protected handleExceptionResponse<TResult extends ActionResult>(error: unknown, status: number): TResult {
        if (error instanceof HttpError) {
            return { success: false, status: error.status, message: error.message } as TResult;
        } else if (error instanceof Error && error.name === ERROR_NAME.ABORT) {
            return {
                success: false,
                status: HTTP_STATUS.REQUEST_TIMEOUT,
                message: "Превышено время ожидания",
            } as TResult;
        } else {
            return { success: false, status: status, message: String(error) } as TResult;
        }
    }
}
