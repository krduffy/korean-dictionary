import "./message-styles.css";

export const LoadingMessage = () => {
    return (
        <div className="loading-message">
            로딩 중<span className="dots"></span>
        </div>
    );
};

export const TrailingDotCustomMessage = ({ customMessage }) => {
    return (
        <div>
            {customMessage}
            <span className="dots" />
        </div>
    );
};
