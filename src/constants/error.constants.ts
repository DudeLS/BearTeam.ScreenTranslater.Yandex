/**
 * Константы для названий ошибок, используемых в обработчиках
 */
export const ERROR_NAME = {
    /**
     * Ошибка отмены запроса (AbortController)
     */
    ABORT: "AbortError",

    /**
     * Ошибка сети (например, недоступность хоста)
     */
    NETWORK: "NetworkError",

    /**
     * Ошибка таймаута (генерируется вручную)
     */
    TIMEOUT: "TimeoutError",
} as const;
