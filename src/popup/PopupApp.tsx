import "./popup.css";
import React, { useEffect, useState } from "react";

const PopupApp: React.FC = () => {
    const [result, setResult] = useState("");
    const [targetLang, setTargetLang] = useState("en");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(["targetLang", "result"], (data: { targetLang?: string; result?: string }) => {
            if (data.targetLang) {
                setTargetLang(data.targetLang);
            }
            if (data.result) {
                setResult(data.result);
            }
        });
        const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.result) {
                setResult(changes.result.newValue as string);
                setLoading(false);
            }
            if (changes.loading) {
                setLoading(changes.loading.newValue as boolean);
            }
        };
        chrome.storage.onChanged.addListener(listener);
        return () => chrome.storage.onChanged.removeListener(listener);
    }, []);

    const startSelection = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab?.id == undefined) {
                setResult("Не удалось определить активную вкладку");
                return;
            }
            // Проверяем, что страница доступна для инжекции
            const url = tab.url || "";
            if (url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("about:")) {
                setResult("Выделение недоступно на этой странице");
                return;
            }
            setLoading(true);
            setResult("");
            chrome.storage.local.set({ loading: true, result: "" });
            // Пытаемся отправить сообщение в content-скрипт
            chrome.tabs.sendMessage(tab.id, { type: "START_SELECTION" }, () => {
                if (chrome.runtime.lastError) {
                    // Content-скрипт не загружен – инжектируем его
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: tab.id! },
                            files: ["content.js"],
                        },
                        () => {
                            if (chrome.runtime.lastError) {
                                setResult("Не удалось загрузить скрипт на страницу");
                                setLoading(false);
                                chrome.storage.local.set({ loading: false, result: "Ошибка инжекции" });
                                return;
                            }
                            // После инжекции повторно отправляем команду
                            chrome.tabs.sendMessage(tab.id!, { type: "START_SELECTION" });
                        },
                    );
                }
            });
        });
    };

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        setTargetLang(lang);
        chrome.storage.local.set({ targetLang: lang });
    };

    return (
        <div className="popup-container">
            <h3 className="popup-title">Перевод выделенной области</h3>
            <div className="controls">
                <button className="btn-primary" onClick={startSelection} disabled={loading}>
                    {loading ? "Обработка..." : "Выделить область"}
                </button>
                <select className="lang-select" value={targetLang} onChange={handleLangChange}>
                    <option value="en">Английский</option>
                    <option value="ru">Русский</option>
                    <option value="fr">Французский</option>
                    <option value="de">Немецкий</option>
                </select>
            </div>
            {result && (
                <div>
                    <strong>Результат:</strong>
                    <p className="result-box">{result}</p>
                </div>
            )}
            {loading && <p className="loading-text">⏳ Идёт распознавание и перевод...</p>}
        </div>
    );
};

export default PopupApp;
