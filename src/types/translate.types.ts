import { ActionResult } from "./yandex.types";

/**
 * Формат текста
 */
export type TranslateFormat = "PLAIN_TEXT" | "HTML";

/**
 * Параметры запроса на перевод текста
 */
export type TranslateTextParams = {
    /**
     * Массив строк для перевода
     */
    texts: string[];
    /**
     * Формат текста
     */
    format?: TranslateFormat;
    /**
     * Код языка оригинала (например, 'en')
     */
    sourceLang: string;
    /**
     * Код языка перевода (например, 'ru')
     */
    targetLang: string;
};

/**
 * Объект с результатом или ошибкой перевода
 */
export interface TranslateTextResult extends ActionResult {
    /**
     * Массив переводов текста
     */
    translations?: string[];
}
