import "./validation-message.css";
import React from "react";

type ValidationProps = {
    visible: boolean;
    message: string;
    type?: ValidationType;
};

export enum ValidationType {
    Warning,
    Exception,
}

export const ValidationMessage: React.FC<ValidationProps> = ({ visible, message, type = ValidationType.Exception }) => {
    if (!visible) {
        return null;
    }
    let messageType: string;
    switch (type) {
        case ValidationType.Warning:
            messageType = "validation-warning";
            break;
        default:
            messageType = "validation-exception";
            break;
    }
    return <div className={`validation-message ${messageType}`}>{message}</div>;
};
