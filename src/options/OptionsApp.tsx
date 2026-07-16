import "./options.css";
import React, { useState, useEffect } from "react";
import { DEFAULT_TRANSLATE_TEXT_URL, TranslateService } from "../services/translate.service";
import { DEFAULT_RECOGNIZE_TEXT_URL, RecognizeService } from "../services/recognize.service";

const KEYS = {
    YANDEX_API_KEY: "yandexApiKey",
    YANDEX_FOLDER_ID: "yandexFolderId",
    TRANSLATE_ENDPOINT: "translateTextUrl",
    RECOGNIZE_ENDPOINT: "recognizeTextUrl",
};

const TEST_IMAGE_BASE64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const ValidationMessage: React.FC<{ valid: boolean; message: string }> = ({ valid, message }) => {
    return valid ? null : <div className="error-message">{message}</div>;
};

const OptionsApp: React.FC = () => {
    const [apiKey, setApiKey] = useState("");
    const [folderId, setFolderId] = useState("");
    const [status, setStatus] = useState("");
    const [translateEndpoint, setTranslateEndpoint] = useState(DEFAULT_TRANSLATE_TEXT_URL);
    const [recognizeEndpoint, setRecognizeEndpoint] = useState(DEFAULT_RECOGNIZE_TEXT_URL);
    const [disabled, setDisabled] = useState(false);

    const [isApiKeyValid, setIsApiKeyValid] = useState(true);
    const [isFolderIdValid, setIsFolderIdValid] = useState(true);
    const [isTranslateEndpointValid, setIsTranslateEndpointValid] = useState(true);
    const [isRecognizeEndpointValid, setIsRecognizeEndpointValid] = useState(true);
    const [apiKeyErrorMsg, setApiKeyErrorMsg] = useState("");
    const [folderIdErrorMsg, setFolderIdErrorMsg] = useState("");
    const [translateEndpointErrorMsg, setTranslateEndpointErrorMsg] = useState("");
    const [recognizeEndpointErrorMsg, setRecognizeEndpointErrorMsg] = useState("");

    const [showApiKey, setShowApiKey] = useState(false);
    const [showFolderId, setShowFolderId] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(
            [KEYS.YANDEX_API_KEY, KEYS.YANDEX_FOLDER_ID, KEYS.TRANSLATE_ENDPOINT, KEYS.RECOGNIZE_ENDPOINT],
            (data: any) => {
                const apiKey = data.yandexApiKey || "";
                const folderId = data.yandexFolderId || "";
                const translateEndpoint = data.translateTextUrl || DEFAULT_TRANSLATE_TEXT_URL;
                const recognizeEndpoint = data.recognizeTextUrl || DEFAULT_RECOGNIZE_TEXT_URL;
                setApiKey(apiKey);
                setFolderId(folderId);
                setTranslateEndpoint(translateEndpoint);
                setRecognizeEndpoint(recognizeEndpoint);
            },
        );
    }, []);

    const validateApiKey = (value: string): boolean => {
        const trimmed = value.trim();
        let isValid = false;
        let errorMsg = "";

        if (!trimmed) {
            errorMsg = "Значение обязателено для заполнения";
        } else if (trimmed.length < 20) {
            errorMsg = "Значение должено содержать минимум 20 символов";
        } else {
            isValid = true;
        }

        setIsApiKeyValid(isValid);
        setApiKeyErrorMsg(errorMsg);

        return isValid;
    };

    const validateFolderId = (value: string): boolean => {
        const trimmed = value.trim();
        let isValid = false;
        let errorMsg = "";

        if (!trimmed) {
            errorMsg = "Значение обязателено для заполнения";
        } else if (trimmed.length < 10) {
            errorMsg = "Значение должено содержать минимум 10 символов";
        } else {
            isValid = true;
        }

        setIsFolderIdValid(isValid);
        setFolderIdErrorMsg(errorMsg);

        return isValid;
    };

    const validateTranslateEndpoint = (value: string): boolean => {
        const trimmed = value.trim();
        let isValid = false;
        let errorMsg = "";

        if (!trimmed) {
            errorMsg = "Значение обязателено для заполнения";
        } else {
            try {
                new URL(trimmed);
                isValid = true;
            } catch {
                errorMsg = "Некорректный URL";
            }
        }

        setIsTranslateEndpointValid(isValid);
        setTranslateEndpointErrorMsg(errorMsg);

        return isValid;
    };

    const validateRecognizeEndpoint = (value: string): boolean => {
        const trimmed = value.trim();
        let isValid = false;
        let errorMsg = "";

        if (!trimmed) {
            errorMsg = "Значение обязателено для заполнения";
        } else {
            try {
                new URL(trimmed);
                isValid = true;
            } catch {
                errorMsg = "Некорректный URL";
            }
        }

        setIsRecognizeEndpointValid(isValid);
        setRecognizeEndpointErrorMsg(errorMsg);

        return isValid;
    };

    const onApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setApiKey(value);
        validateApiKey(value);
    };

    const onFolderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFolderId(value);
        validateFolderId(value);
    };

    const onTranslateEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTranslateEndpoint(value);
        validateTranslateEndpoint(value);
    };

    const onRecognizeEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRecognizeEndpoint(value);
        validateRecognizeEndpoint(value);
    };

    const validateOptions = (): boolean => {
        const isValidApiKey = validateApiKey(apiKey);
        const isValidFolderId = validateFolderId(folderId);
        const isValidTranslateEndpoint = validateTranslateEndpoint(translateEndpoint);
        const isValidRecognizeEndpoint = validateRecognizeEndpoint(recognizeEndpoint);
        return isValidApiKey && isValidFolderId && isValidTranslateEndpoint && isValidRecognizeEndpoint;
    };

    const saveOptions = () => {
        if (validateOptions()) {
            chrome.storage.local.set(
                {
                    yandexApiKey: apiKey.trim(),
                    yandexFolderId: folderId.trim(),
                    translateTextUrl: translateEndpoint.trim(),
                    recognizeTextUrl: recognizeEndpoint.trim(),
                },
                () => {
                    setStatus("Настройки сохранены");
                    setTimeout(() => setStatus(""), 3000);
                },
            );
        }
    };

    const clearOptions = () => {
        if (window.confirm("Вы уверены, что хотите очистить все настройки?")) {
            chrome.storage.local.remove([KEYS.YANDEX_API_KEY, KEYS.YANDEX_FOLDER_ID], () => {
                setApiKey("");
                setIsApiKeyValid(true);
                setApiKeyErrorMsg("");
                setFolderId("");
                setIsFolderIdValid(true);
                setFolderIdErrorMsg("");
                setTranslateEndpoint(DEFAULT_TRANSLATE_TEXT_URL);
                setIsTranslateEndpointValid(true);
                setTranslateEndpointErrorMsg("");
                setRecognizeEndpoint(DEFAULT_RECOGNIZE_TEXT_URL);
                setIsRecognizeEndpointValid(true);
                setRecognizeEndpointErrorMsg("");
                setStatus("Настройки очищены");
                setTimeout(() => setStatus(""), 3000);
            });
        }
    };

    const toggleShowApiKey = () => setShowApiKey(!showApiKey);
    const toggleShowFolderId = () => setShowFolderId(!showFolderId);

    const checkTranslateEndpoint = async () => {
        const isValidApiKey = validateApiKey(apiKey);
        const isValidFolderId = validateFolderId(folderId);
        const isValidTranslateEndpoint = validateTranslateEndpoint(translateEndpoint);
        if (!isValidApiKey || !isValidFolderId || !isValidTranslateEndpoint) {
            return;
        }

        setDisabled(true);
        setStatus("⏳ Проверка...");

        try {
            const service = new TranslateService({
                apiKey: apiKey.trim(),
                folderId: folderId.trim(),
                translateTextUrl: translateEndpoint.trim(),
            });
            const result = await service.translateText({
                texts: ["Hello"],
                sourceLang: "en",
                targetLang: "ru",
            });
            if (result.success) {
                setStatus(`✅ Translate доступен (перевод: "${result.translations?.[0] || ""}")`);
            } else {
                setStatus(`❌ Ошибка: ${result.message || "неизвестная ошибка"}`);
            }
        } catch (error: any) {
            setStatus(`❌ Ошибка: ${error.message || String(error)}`);
        } finally {
            setDisabled(false);
            setTimeout(() => setStatus(""), 3000);
        }
    };

    const checkRecognizeEndpoint = async () => {
        const isValidApiKey = validateApiKey(apiKey);
        const isValidFolderId = validateFolderId(folderId);
        const isValidRecognizeEndpoint = validateRecognizeEndpoint(recognizeEndpoint);
        if (!isValidApiKey || !isValidFolderId || !isValidRecognizeEndpoint) {
            return;
        }

        setDisabled(true);
        setStatus("⏳ Проверка...");

        try {
            const service = new RecognizeService({
                apiKey: apiKey.trim(),
                folderId: folderId.trim(),
                recognizeTextUrl: recognizeEndpoint.trim(),
            });
            const result = await service.recognizeText({
                image: TEST_IMAGE_BASE64,
                format: "PNG",
                langs: ["ru", "en"],
            });
            if (result.success) {
                setStatus(`✅ Recognize доступен (распознано: "${result.recognition || ""}")`);
            } else {
                setStatus(`❌ Ошибка: ${result.message || "неизвестная ошибка"}`);
            }
        } catch (error: any) {
            setStatus(`❌ Ошибка: ${error.message || String(error)}`);
        } finally {
            setDisabled(false);
            setTimeout(() => setStatus(""), 3000);
        }
    };

    return (
        <div className="container">
            <h1>Настройки расширения</h1>
            <div className="form-group">
                <label htmlFor="apiKey">Yandex API Key</label>
                <div className="input-wrapper">
                    <input
                        id="apiKey"
                        type="text"
                        value={apiKey}
                        onChange={onApiKeyChange}
                        className={`${isApiKeyValid ? "" : "error-input"} ${!showApiKey ? "hidden-text" : ""}`}
                        placeholder="Введите API Key"
                        autoComplete="off"
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="toggle-visibility"
                        onClick={toggleShowApiKey}
                        title={showApiKey ? "Скрыть" : "Показать"}
                        aria-label={showApiKey ? "Скрыть API Key" : "Показать API Key"}
                        disabled={disabled}
                    >
                        {showApiKey ? "🙈" : "👁️"}
                    </button>
                </div>
                <ValidationMessage valid={isApiKeyValid} message={apiKeyErrorMsg} />
            </div>
            <div className="form-group">
                <label htmlFor="folderId">Yandex Folder ID</label>
                <div className="input-wrapper">
                    <input
                        id="folderId"
                        type="text"
                        value={folderId}
                        onChange={onFolderIdChange}
                        className={`${isFolderIdValid ? "" : "error-input"} ${!showFolderId ? "hidden-text" : ""}`}
                        placeholder="Введите Folder ID"
                        autoComplete="off"
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="toggle-visibility"
                        onClick={toggleShowFolderId}
                        title={showFolderId ? "Скрыть" : "Показать"}
                        aria-label={showFolderId ? "Скрыть Folder ID" : "Показать Folder ID"}
                        disabled={disabled}
                    >
                        {showFolderId ? "🙈" : "👁️"}
                    </button>
                </div>
                <ValidationMessage valid={isFolderIdValid} message={folderIdErrorMsg} />
            </div>
            <div className="form-group">
                <label htmlFor="translateEndpoint">Translate Text URL</label>
                <div className="input-wrapper">
                    <input
                        id="translateEndpoint"
                        type="text"
                        value={translateEndpoint}
                        onChange={onTranslateEndpointChange}
                        className={isTranslateEndpointValid ? "" : "error-input"}
                        placeholder="https://..."
                        autoComplete="off"
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="check-button"
                        onClick={checkTranslateEndpoint}
                        disabled={disabled || !isTranslateEndpointValid}
                    >
                        {disabled ? "⏳" : "🔍"}
                    </button>
                </div>
                <ValidationMessage valid={isTranslateEndpointValid} message={translateEndpointErrorMsg} />
            </div>
            <div className="form-group">
                <label htmlFor="recognizeEndpoint">Recognize Text URL</label>
                <div className="input-wrapper">
                    <input
                        id="recognizeEndpoint"
                        type="text"
                        value={recognizeEndpoint}
                        onChange={onRecognizeEndpointChange}
                        className={isRecognizeEndpointValid ? "" : "error-input"}
                        placeholder="https://..."
                        autoComplete="off"
                        disabled={disabled}
                    />
                    <button
                        type="button"
                        className="check-button"
                        onClick={checkRecognizeEndpoint}
                        disabled={disabled || !isRecognizeEndpointValid}
                    >
                        {disabled ? "⏳" : "🔍"}
                    </button>
                </div>
                <ValidationMessage valid={isRecognizeEndpointValid} message={recognizeEndpointErrorMsg} />
            </div>
            <div className="button-group">
                <button onClick={saveOptions}>Сохранить</button>
                <button onClick={clearOptions} className="clear-button">
                    Сбросить
                </button>
            </div>
            {status && <p className="status-message">{status}</p>}
        </div>
    );
};

export default OptionsApp;
