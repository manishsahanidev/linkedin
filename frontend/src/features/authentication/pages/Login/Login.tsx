import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import classes from "./Login.module.scss";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Seperator } from "../../components/Separator/Seperator";
import { Layout } from "../../components/Layout/Layout";
import { useAuthentication } from "../../context/AuthenticationContextProvider";

export function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthentication();
    const navigate = useNavigate();
    const location = useLocation();

    const doLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;

        //console.log(email, password);

        try {
            await login(email, password);
            const destination = location.state?.from || "/";
            navigate(destination);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred.")
            }
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <Layout className={classes.root}>
            <Box>

                <h1>Sign in</h1>
                <p>Stay updated on your professional world.</p>

                <form onSubmit={doLogin}>

                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        onFocus={() => setErrorMessage("")}
                    />

                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        onFocus={() => setErrorMessage("")}
                    />

                    {errorMessage && <p className={classes.error}>{errorMessage}</p>}

                    <Button
                        type="submit"
                        disabled={isLoading}>
                        {isLoading ? "..." : "Sign in"}
                    </Button>

                    <Link to="/reset-password">Forgot password?</Link>

                </form>

                <Seperator>Or</Seperator>

                <div className={classes.register}>
                    New to LinkedIn? <Link to="/signup">Join now</Link>
                </div>
            </Box>
        </Layout>
    );
}