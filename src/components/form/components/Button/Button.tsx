import React from 'react';
import { useFormikContext } from 'formik';
import './Button.css';

interface Props {
    title: string,
    isOutLined?: boolean,
    isFullWidth?: boolean
}
function Button({ title, isOutLined = false, isFullWidth = true }: Props) {
    const { handleSubmit } : any  = useFormikContext();

    return (
        <button onClick={handleSubmit}  type="submit" className={`u-margin-bottom-small btn-auth ${!isFullWidth ? 'not-full-width ' : ''} ${isOutLined ? 'outlined' : ''}`}>{title}</button>
    );
}

export default Button;