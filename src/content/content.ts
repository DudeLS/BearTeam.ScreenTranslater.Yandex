import "./content.css";

const CONTENT_STYLESHEET_ID = "screen-translator-styles";

(() => {
    let link = document.getElementById(CONTENT_STYLESHEET_ID);
    if (link) {
        return;
    }
    link = document.createElement("link");
    link.id = CONTENT_STYLESHEET_ID;
    (link as HTMLLinkElement).rel = "stylesheet";
    (link as HTMLLinkElement).href = chrome.runtime.getURL("content.css");
    document.head.appendChild(link);
})();

const OVERLAY_CLASS = "screen-translator-overlay";
const SELECTION_CLASS = "screen-translator-selection";

let startX = 0,
    startY = 0;
let isSelecting = false;
const MESSAGES = {
    START_SELECTION: "START_SELECTION",
};

// Обработчик сообщений
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === MESSAGES.START_SELECTION) {
        createOverlay();
    }
});

function removeAllOverlays() {
    document.querySelectorAll(`.${OVERLAY_CLASS}`).forEach((el) => el.remove());
    document.querySelectorAll(`.${SELECTION_CLASS}`).forEach((el) => el.remove());
    // Удаляем глобальный обработчик Escape
    document.removeEventListener("keydown", onKeyDown);
    isSelecting = false;
}

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
        removeAllOverlays();
    }
}

function createOverlay() {
    removeAllOverlays();

    // Создаём затемняющий фон
    const overlay = document.createElement("div");
    overlay.className = OVERLAY_CLASS;
    document.body.appendChild(overlay);

    // Создаём выделение
    const selection = document.createElement("div");
    selection.className = SELECTION_CLASS;
    document.body.appendChild(selection);

    // Обработчики
    const onMouseDown = (e: MouseEvent) => {
        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;
        selection.style.display = "block";
        selection.style.left = startX + "px";
        selection.style.top = startY + "px";
        selection.style.width = "0px";
        selection.style.height = "0px";
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isSelecting) return;
        const x = Math.min(e.clientX, startX);
        const y = Math.min(e.clientY, startY);
        const w = Math.abs(e.clientX - startX);
        const h = Math.abs(e.clientY - startY);
        selection.style.left = x + "px";
        selection.style.top = y + "px";
        selection.style.width = w + "px";
        selection.style.height = h + "px";
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!isSelecting) {
            // Если выделение не активно, просто удаляем оверлей
            removeAllOverlays();
            return;
        }

        const rect = selection.getBoundingClientRect();
        try {
            chrome.runtime.sendMessage({
                type: "AREA_SELECTED",
                payload: {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                },
            });
        } catch (err) {
            console.warn("Ошибка отправки сообщения:", err);
        } finally {
            removeAllOverlays();
        }
    };

    overlay.addEventListener("mousedown", onMouseDown);
    overlay.addEventListener("mousemove", onMouseMove);
    overlay.addEventListener("mouseup", onMouseUp);

    // Глобальный обработчик Escape (удаляем старый, если был)
    document.removeEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", onKeyDown);
}
