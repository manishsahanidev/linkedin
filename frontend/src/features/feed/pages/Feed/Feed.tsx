import { useAuthentication } from '../../../authentication/context/AuthenticationContextProvider';
import classes from './Feed.module.scss';

export const Feed = () => {
    const { user, logout } = useAuthentication();
    return (
        <div className={classes.root}>

            <header className={classes.header}>
                <div>Hello {user?.email}</div>
                <span> | </span>
                <button onClick={logout}>Logout</button>
            </header>

            <main className={classes.content}>

                <div className={classes.left}>Left</div>

                <div className={classes.center}>
                    <div className={classes.posting}>center : post</div>
                    <div className={classes.feed}>center : feed</div>
                </div>

                <div className={classes.right}>right</div>

            </main>
        </div>
    )
}
