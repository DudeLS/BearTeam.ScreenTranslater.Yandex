export interface ActionResult {
    /**
     * Успешный ли запрос
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
}

export interface RequestErrorResult {
    code: number;
    message: string;
}
