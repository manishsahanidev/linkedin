import { InputHTMLAttributes } from 'react'
import classes from './Input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    variant?: "small" | "medium" | "large";
};

export const Input = ({ label, variant, width, ...otherProps }: InputProps) => {
    return (
        <div className={`${classes.root} ${classes[variant || "large"]}`}>
            <label>{label}</label>
            <input {...otherProps}
                style={{
                    width: width ? `${width}px` : "100%"
                }}
            />
        </div>
    )
}
