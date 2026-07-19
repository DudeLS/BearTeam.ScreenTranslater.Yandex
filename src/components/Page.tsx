import "./page.css";
import React from "react";

interface PageProps {
    /** Дополнительный CSS-класс (опционально) */
    className?: string;
    /** Содержимое панели (опционально)*/
    children?: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ className = "", children }) => {
    return <div className={className}>{children}</div>;
};
