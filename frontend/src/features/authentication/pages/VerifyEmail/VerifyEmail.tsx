import classes from './VerifyEmail.module.scss'
import { Input } from '../../../../components/Input/Input'
import { useState } from 'react'
import { Button } from '../../../../components/Button/Button'
import { Box } from '../../components/Box/Box'
import { useNavigate } from 'react-router-dom'
import { useAuthentication } from '../../context/AuthenticationContextProvider'
import { request } from '../../../../utils/api'

export const VerifyEmail = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useAuthentication();
    const navigate = useNavigate();

    const validateEmail = async (code: string) => {
        setMessage("");
        await request<void>({
            endpoint: `/api/v1/authentication/validate-email-verification-token?token=${code}`,
            method: "PUT",
            onSuccess: () => {
                setErrorMessage("");
                setUser({ ...user!, emailVerified: true });
                navigate('/');
            },
            onFailure: (error) => {
                setErrorMessage(error);
            },
        });
        setIsLoading(false);
    };

    // 
    const sendEmailVerificationToken = async () => {
        setErrorMessage("");

        await request<void>({
            endpoint: `/api/v1/authentication/send-email-verification-token`,
            onSuccess: () => {
                setErrorMessage("");
                setMessage("Verification email sent. Please check your inbox.");
            },
            onFailure: (error) => {
                setErrorMessage(error);
            },
        });
        setIsLoading(false);
    };

    return (
        <div className={classes.root}>
            <Box>
                <h1>Verify your email</h1>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    const code = e.currentTarget.code.value;
                    await validateEmail(code);
                    setIsLoading(false);
                }}>
                    <p>
                        We have sent a verification email to your email address. Please check your inbox and verify your email.
                    </p>

                    <Input
                        type='text'
                        label='Verification code'
                        key="code"
                        name='code'
                    />

                    {message ? <p style={{ color: "green" }}>{message}</p> : null}
                    {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}

                    <Button
                        type='submit'
                        disabled={isLoading}>
                        {isLoading ? "..." : "Validate email"}
                    </Button>

                    <Button
                        type='button'
                        outline
                        onClick={() => {
                            sendEmailVerificationToken();
                        }}
                        disabled={isLoading}>
                        {isLoading ? "..." : "Send again"}
                    </Button>
                </form>
            </Box>
        </div>
    );
}
