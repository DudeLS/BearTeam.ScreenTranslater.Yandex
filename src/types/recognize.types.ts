import { ActionResult } from "./yandex.types";

/**
 * Формат изображения
 */
export type ImageFormat = "PNG" | "JPEG" | "PDF";

/**
 * Параметры запроса на распознование текста
 */
export type RecognizeTextParams = {
    /**
     * Изображение (Base64)
     */
    image: string;
    /**
     * Формат изображения
     */
    format: ImageFormat;
    /**
     * Список кодов языков для распознавания
     */
    langs: string[];
};

/**
 * Объект с результатом или ошибкой распознования
 */
export interface RecognizeTextResult extends ActionResult {
    /**
     * Распознанный текст
     */
    recognition?: string;
    /**
     * Массив распознанных текстов
     */
    recognitions?: string[];
}
