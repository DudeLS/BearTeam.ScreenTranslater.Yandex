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
export type TranslateTextResult = {
    /**
     * Успешный ли перевод
     */
    success: boolean;
    /**
     * Статус запроса
     */
    status: number;
    /**
     * Описание ошибки
     */
    message?: string;
    /**
     * Массив переводов текста
     */
    translations?: string[];
};
