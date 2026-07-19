import "./notify-toast.css";
import React from "react";

type NotifyProps = {
    visible: boolean;
    message: string;
    type?: NotifyType;
};

export enum NotifyType {
    Default,
    Success,
    Warning,
    Exception,
}

export const NotifyToast: React.FC<NotifyProps> = ({ visible, message, type = NotifyType.Default }) => {
    if (!visible) {
        return null;
    }
    let messageType: string;
    switch (type) {
        case NotifyType.Success:
            messageType = "notify-success";
            break;
        case NotifyType.Warning:
            messageType = "notify-warning";
            break;
        case NotifyType.Exception:
            messageType = "notify-exception";
            break;
        default:
            messageType = "notify-default";
            break;
    }
    return (
        <div className={`notify-toast ${messageType}`}>
            <span className="notify-message">{message}</span>
        </div>
    );
};
