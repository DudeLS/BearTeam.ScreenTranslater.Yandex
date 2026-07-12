import "./options.css";
import React, { useState, useEffect } from "react";

const OptionsApp: React.FC = () => {
    const [apiKey, setApiKey] = useState("");
    const [folderId, setFolderId] = useState("");
    const [status, setStatus] = useState("");

    // Загружаем сохранённые значения при монтировании
    useEffect(() => {
        chrome.storage.local.get(
            ["yandexFolderId", "yandexApiKey"],
            (data: { yandexFolderId?: string; yandexApiKey?: string }) => {
                if (data.yandexFolderId) {
                    setFolderId(data.yandexFolderId);
                }
                if (data.yandexApiKey) {
                    setApiKey(data.yandexApiKey);
                }
            },
        );
    }, []);

    const saveOptions = () => {
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
    };

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
            <h1>Настройки расширения</h1>
            <div style={{ marginBottom: "16px" }}>
                <label htmlFor="apiKey">Yandex API Key:</label>
                <input
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    placeholder="Введите API-ключ"
                />
            </div>
            <div style={{ marginBottom: "16px" }}>
                <label htmlFor="folderId">Yandex Folder ID:</label>
                <input
                    id="folderId"
                    type="text"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    placeholder="Введите Folder ID"
                />
            </div>
            <button onClick={saveOptions} style={{ padding: "8px 16px" }}>
                Сохранить
            </button>
            {status && <p style={{ marginTop: "12px", color: "green" }}>{status}</p>}
        </div>
    );
};

export default OptionsApp;
