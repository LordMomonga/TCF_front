import React from 'react';
import './error.css';

function ErrorMessage({ error, visible } : any) {
    if(!visible || !error) return null;

    return (
        <div className="auth-error-text">{error}</div>
    );
}

export default ErrorMessage;
