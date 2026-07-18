import "./groupbox.css";
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
export const Groupbox: React.FC<GroupboxProps> = ({ title, iconClass = "", className = "", children }) => {
    return (
        <div className={`groupbox ${className}`}>
            <div className="groupbox-header">
                <h2 className={`groupbox-title ${iconClass}`}>{title}</h2>
            </div>
            <div className="groupbox-content">{children}</div>
        </div>
    );
};
