import { ButtonHTMLAttributes } from 'react';
import classes from './Button.module.scss'
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    outline?: boolean;
    size?: "small" | "medium" | "large";
};

export const Button = ({
    outline,
    children,
    className,
    size = "large",
    ...others
}: ButtonProps) => {
    return (
        <button
            {...others}
            className={clsx(
                classes.button,
                classes[size],
                outline && classes.outline,
                className
            )}
        >
            {children}
        </button>
    );
};
