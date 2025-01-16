import { ReactNode } from 'react'
import classes from './Seperator.module.scss'

export const Seperator = (
    { children }: { children: ReactNode }
) => {
    return (
        <div className={classes.root}>{children}</div>
    )
}
