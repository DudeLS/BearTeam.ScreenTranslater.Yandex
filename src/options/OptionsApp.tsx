import "./options.css";
import React, { useState, useEffect } from "react";
import { DEFAULT_TRANSLATE_TEXT_URL, TranslateService } from "../services/translate.service";
import { DEFAULT_RECOGNIZE_TEXT_URL, RecognizeService } from "../services/recognize.service";
import { NotifyToast, NotifyType } from "../components/NotifyToast";
import { GroupBox } from "../components/GroupBox";
import { Page } from "../components/Page";
import { ValidationMessage } from "../components/ValidationMessage";

const STORAGE_KEY = {
    YANDEX_API_KEY: "yandexApiKey",
    YANDEX_FOLDER_ID: "yandexFolderId",
    TRANSLATE_ENDPOINT: "translateTextUrl",
    RECOGNIZE_ENDPOINT: "recognizeTextUrl",
};

const TEST_IMAGE_BASE64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

let timerId: any;

const OptionsApp: React.FC = () => {
    const [apiKey, setApiKey] = useState("");
    const [folderId, setFolderId] = useState("");
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
    const [isTranslateEndpointChecking, setIsTranslateEndpointChecking] = useState(false);
    const [isRecognizeEndpointChecking, setIsRecognizeEndpointChecking] = useState(false);

    const [notifyType, setNotifyType] = useState(NotifyType.Default);
    const [notifyMessage, setNotifyMessage] = useState("");
    const [notifyVisible, setNotifyVisible] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(
            [
                STORAGE_KEY.YANDEX_API_KEY,
                STORAGE_KEY.YANDEX_FOLDER_ID,
                STORAGE_KEY.TRANSLATE_ENDPOINT,
                STORAGE_KEY.RECOGNIZE_ENDPOINT,
            ],
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
                    setupNotify("Настройки сохранены", NotifyType.Success);
                    setTimeout(() => clearNotify(), 3000);
                },
            );
        }
    };

    const clearOptions = () => {
        if (window.confirm("Вы уверены, что хотите очистить все настройки?")) {
            chrome.storage.local.remove([STORAGE_KEY.YANDEX_API_KEY, STORAGE_KEY.YANDEX_FOLDER_ID], () => {
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
                setupNotify("Настройки очищены", NotifyType.Success);
                setTimeout(() => clearNotify(), 3000);
            });
        }
    };

    const setupNotify = (message: string, type: NotifyType = NotifyType.Default) => {
        clearTimeout(timerId);
        setNotifyVisible(true);
        setNotifyMessage(message);
        setNotifyType(type);
    };

    const clearNotify = () => {
        timerId = setTimeout(() => {
            setNotifyVisible(false);
            setNotifyMessage("");
            setNotifyType(NotifyType.Default);
            clearTimeout(timerId);
        }, 3000);
    };

    const toggleShowApiKey = () => setShowApiKey(!showApiKey);
    const toggleShowFolderId = () => setShowFolderId(!showFolderId);

    const delay = (ms: number): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const checkTranslateEndpoint = async () => {
        const isValidApiKey = validateApiKey(apiKey);
        const isValidFolderId = validateFolderId(folderId);
        const isValidTranslateEndpoint = validateTranslateEndpoint(translateEndpoint);
        if (!isValidApiKey || !isValidFolderId || !isValidTranslateEndpoint) {
            return;
        }

        setDisabled(true);
        setupNotify("Пожалуйста, подождите...");
        setIsTranslateEndpointChecking(true);

        try {
            await delay(3000);

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
                setupNotify("Сервис перевода доступен", NotifyType.Success);
            } else {
                const message = result.message || "неизвестная ошибка";
                setupNotify(`Сервис недоступен: ${message}`, NotifyType.Exception);
            }
        } catch (error: any) {
            const message = error.message || String(error);
            setupNotify(`Сервис недоступен: ${message}`, NotifyType.Exception);
        } finally {
            clearNotify();
            setDisabled(false);
            setIsTranslateEndpointChecking(false);
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
        setupNotify("Пожалуйста, подождите...");
        setIsRecognizeEndpointChecking(true);

        try {
            await delay(2000);

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
                setupNotify("Сервис распознования доступен", NotifyType.Success);
            } else {
                const message = result.message || "неизвестная ошибка";
                setupNotify(`Сервис недоступен: ${message}`, NotifyType.Exception);
            }
        } catch (error: any) {
            const message = error.message || String(error);
            setupNotify(`Сервис недоступен: ${message}`, NotifyType.Exception);
        } finally {
            clearNotify();
            setDisabled(false);
            setIsRecognizeEndpointChecking(false);
        }
    };

    const getApiKeyInputClasses = () => {
        const classes: string[] = ["input-text"];
        if (!isApiKeyValid) {
            classes.push("input-text--error");
        }
        if (!showApiKey) {
            classes.push("input-text--hidden");
        }
        return classes.join(" ");
    };

    const getApiKeyButtonClasses = () => {
        const classes: string[] = ["button", "button-icon"];
        if (showApiKey) {
            classes.push("icon-eye_closed");
        } else {
            classes.push("icon-eye_opened");
        }
        return classes.join(" ");
    };

    const getFolderIdInputClasses = () => {
        const classes: string[] = ["input-text"];
        if (!isFolderIdValid) {
            classes.push("input-text--error");
        }
        if (!showFolderId) {
            classes.push("input-text--hidden");
        }
        return classes.join(" ");
    };

    const getFolderIdButtonClasses = () => {
        const classes: string[] = ["button", "button-icon"];
        if (showFolderId) {
            classes.push("icon-eye_closed");
        } else {
            classes.push("icon-eye_opened");
        }
        return classes.join(" ");
    };

    const getTranslateEndpointInputClasses = () => {
        const classes: string[] = ["input-text"];
        if (!isTranslateEndpointValid) {
            classes.push("input-text--error");
        }
        return classes.join(" ");
    };

    const getTranslateEndpointButtonClasses = () => {
        const classes: string[] = ["button", "button-icon"];
        if (isTranslateEndpointChecking) {
            classes.push("icon-spinner");
        } else {
            classes.push("icon-search");
        }
        return classes.join(" ");
    };

    const getRecognizeEndpointInputClasses = () => {
        const classes: string[] = ["input-text"];
        if (!isRecognizeEndpointValid) {
            classes.push("input-text--error");
        }
        return classes.join(" ");
    };

    const getRecognizeEndpointButtonClasses = () => {
        const classes: string[] = ["button", "button-icon"];
        if (isRecognizeEndpointChecking) {
            classes.push("icon-spinner");
        } else {
            classes.push("icon-search");
        }
        return classes.join(" ");
    };

    return (
        <Page className="options-page">
            <NotifyToast visible={notifyVisible} message={notifyMessage} type={notifyType} />
            <GroupBox title="Настройки расширения">
                <div className="form-group">
                    <label htmlFor="apiKey" className="input-label">
                        Yandex API Key
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="apiKey"
                            type="text"
                            value={apiKey}
                            onChange={onApiKeyChange}
                            className={getApiKeyInputClasses()}
                            placeholder="Введите API Key"
                            autoComplete="off"
                            disabled={disabled}
                            required={true}
                        />
                        <button
                            type="button"
                            onClick={toggleShowApiKey}
                            className={getApiKeyButtonClasses()}
                            title={showApiKey ? "Скрыть" : "Показать"}
                            aria-label={showApiKey ? "Скрыть" : "Показать"}
                            disabled={disabled}
                        ></button>
                    </div>
                    <ValidationMessage visible={!isApiKeyValid} message={apiKeyErrorMsg} />
                </div>
                <div className="form-group">
                    <label htmlFor="folderId" className="input-label">
                        Yandex Folder ID
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="folderId"
                            type="text"
                            value={folderId}
                            onChange={onFolderIdChange}
                            className={getFolderIdInputClasses()}
                            placeholder="Введите Folder ID"
                            autoComplete="off"
                            disabled={disabled}
                            required={true}
                        />
                        <button
                            type="button"
                            onClick={toggleShowFolderId}
                            className={getFolderIdButtonClasses()}
                            title={showFolderId ? "Скрыть" : "Показать"}
                            aria-label={showFolderId ? "Скрыть" : "Показать"}
                            disabled={disabled}
                        ></button>
                    </div>
                    <ValidationMessage visible={!isFolderIdValid} message={folderIdErrorMsg} />
                </div>
                <div className="form-group">
                    <label htmlFor="translateEndpoint" className="input-label">
                        Translate Text URL
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="translateEndpoint"
                            type="text"
                            value={translateEndpoint}
                            onChange={onTranslateEndpointChange}
                            className={getTranslateEndpointInputClasses()}
                            placeholder="https://..."
                            autoComplete="off"
                            disabled={disabled}
                            required={true}
                        />
                        <button
                            type="button"
                            onClick={checkTranslateEndpoint}
                            className={getTranslateEndpointButtonClasses()}
                            disabled={disabled || !isTranslateEndpointValid}
                            title="Проверить"
                            aria-label="Проверить"
                        ></button>
                    </div>
                    <ValidationMessage visible={!isTranslateEndpointValid} message={translateEndpointErrorMsg} />
                </div>
                <div className="form-group">
                    <label htmlFor="recognizeEndpoint" className="input-label">
                        Recognize Text URL
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="recognizeEndpoint"
                            type="text"
                            value={recognizeEndpoint}
                            onChange={onRecognizeEndpointChange}
                            className={getRecognizeEndpointInputClasses()}
                            placeholder="https://..."
                            autoComplete="off"
                            disabled={disabled}
                            required={true}
                        />
                        <button
                            type="button"
                            onClick={checkRecognizeEndpoint}
                            className={getRecognizeEndpointButtonClasses()}
                            disabled={disabled || !isRecognizeEndpointValid}
                            title="Проверить"
                            aria-label="Проверить"
                        ></button>
                    </div>
                    <ValidationMessage visible={!isRecognizeEndpointValid} message={recognizeEndpointErrorMsg} />
                </div>
                <div className="button-group">
                    <button onClick={saveOptions} className="button button-primary" disabled={disabled}>
                        Сохранить
                    </button>
                    <button onClick={clearOptions} className="button button-danger" disabled={disabled}>
                        Сбросить
                    </button>
                </div>
            </GroupBox>
        </Page>
    );
};

export default OptionsApp;
