import { ActionResult } from "./yandex.types";

/**
 * Формат изображения
 */
export type ImageFormat = "PNG" | "JPEG" | "PDF";

/**
 * Модель для распознавания
 */
export type RecognizeModel = "page" | "page-column-sort" | "handwritten" | "table" | "markdown" | "math-markdown";

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
    /**
     * Модель для распознавания
     */
    model?: RecognizeModel;
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
