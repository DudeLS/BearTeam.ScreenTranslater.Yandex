import "./options.css";
import React, { useState, useEffect } from "react";

const KEYS = {
    YANDEX_API_KEY: "yandexApiKey",
    YANDEX_FOLDER_ID: "yandexFolderId",
};

const OptionsApp: React.FC = () => {
    const [apiKey, setApiKey] = useState("");
    const [folderId, setFolderId] = useState("");
    const [status, setStatus] = useState("");
    const [isApiKeyValid, setIsApiKeyValid] = useState(true);
    const [apiKeyErrorMsg, setApiKeyErrorMsg] = useState("");
    const [isFolderIdValid, setIsFolderIdValid] = useState(true);
    const [folderIdErrorMsg, setFolderIdErrorMsg] = useState("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [showFolderId, setShowFolderId] = useState(false);

    useEffect(() => {
        chrome.storage.local.get([KEYS.YANDEX_API_KEY, KEYS.YANDEX_FOLDER_ID], (data: any) => {
            const apiKey = data.yandexApiKey || "";
            const folderId = data.yandexFolderId || "";
            setApiKey(apiKey);
            setFolderId(folderId);
        });
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

    const validateOptions = (): boolean => {
        const isValidApiKey = validateApiKey(apiKey);
        const isValidFolderId = validateFolderId(folderId);
        return isValidApiKey && isValidFolderId;
    };

    const saveOptions = () => {
        if (validateOptions()) {
            chrome.storage.local.set(
                {
                    yandexApiKey: apiKey.trim(),
                    yandexFolderId: folderId.trim(),
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
                setFolderId("");
                setIsApiKeyValid(true);
                setApiKeyErrorMsg("");
                setIsFolderIdValid(true);
                setFolderIdErrorMsg("");
                setStatus("Настройки очищены");
                setTimeout(() => setStatus(""), 3000);
            });
        }
    };

    const toggleShowApiKey = () => setShowApiKey(!showApiKey);
    const toggleShowFolderId = () => setShowFolderId(!showFolderId);

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
                    />
                    <button
                        type="button"
                        className="toggle-visibility"
                        onClick={toggleShowApiKey}
                        title={showApiKey ? "Скрыть" : "Показать"}
                        aria-label={showApiKey ? "Скрыть API Key" : "Показать API Key"}
                    >
                        {showApiKey ? "🙈" : "👁️"}
                    </button>
                </div>
                {!isApiKeyValid && <div className="error-message">{apiKeyErrorMsg}</div>}
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
                    />
                    <button
                        type="button"
                        className="toggle-visibility"
                        onClick={toggleShowFolderId}
                        title={showFolderId ? "Скрыть" : "Показать"}
                        aria-label={showFolderId ? "Скрыть Folder ID" : "Показать Folder ID"}
                    >
                        {showFolderId ? "🙈" : "👁️"}
                    </button>
                </div>
                {!isFolderIdValid && <div className="error-message">{folderIdErrorMsg}</div>}
            </div>
            <div className="button-group">
                <button onClick={saveOptions}>Сохранить</button>
                <button onClick={clearOptions} className="clear-button">
                    Очистить
                </button>
            </div>
            {status && <p className="status-message">{status}</p>}
        </div>
    );
};

export default OptionsApp;
