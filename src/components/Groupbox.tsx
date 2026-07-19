import "./group-box.css";
import React from "react";

interface GroupboxProps {
    /** Заголовок */
    title: string;
    /** CSS-класс для иконки (опционально) */
    iconClass?: string;
    /** Дополнительный CSS-класс (опционально) */
    className?: string;
    /** Содержимое панели (опционально)*/
    children?: React.ReactNode;
}

/**
 * Группа (панель) с заголовком и содержимым
 */
export const GroupBox: React.FC<GroupboxProps> = ({ title, iconClass = "", className = "", children }) => {
    return (
        <div className={`group-box ${className}`}>
            <div className="group-box__header">
                <h2 className={`group-box__title ${iconClass}`}>{title}</h2>
            </div>
            <div className="group-box__content">{children}</div>
        </div>
    );
};
