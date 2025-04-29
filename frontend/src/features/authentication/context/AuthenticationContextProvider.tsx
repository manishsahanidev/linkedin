import { Dispatch, createContext, useContext, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";
import { request } from "../../../utils/api";

interface AuthenticationResponse {
    token: string;
    message: string;
}

export interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    company?: string;
    position?: string;
    location?: string;
    profileComplete: boolean;
    profilePicture?: string;
}

interface AuthenticationContextType {
    user: User | null;
    setUser: Dispatch<React.SetStateAction<User | null>>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export function useAuthentication() {
    return useContext(AuthenticationContext)!;
}

export const AuthenticationContextProvider = () => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const isOnAuthPage =
        location.pathname === "/authentication/login" ||
        location.pathname === "/authentication/signup" ||
        location.pathname === "/authentication/reset-password";

    const login = async (email: string, password: string) => {
        await request<AuthenticationResponse>({
            endpoint: "/api/v1/authentication/login",
            method: "POST",
            body: JSON.stringify({ email, password }),
            onSuccess: ({ token }) => {
                localStorage.setItem("token", token);
            },
            onFailure: (error) => {
                throw new Error(error);
            }
        });
    };

    const signup = async (email: string, password: string) => {
        await request<AuthenticationResponse>({
            endpoint: "/api/v1/authentication/register",
            method: "POST",
            body: JSON.stringify({ email, password }),
            onSuccess: ({ token }) => {
                localStorage.setItem("token", token);
            },
            onFailure: (error) => {
                throw new Error(error);
            }
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    useEffect(() => {
        if (user) {
            return;
        }
        setIsLoading(true);
        const fetchUser = async () => {
            await request<User>({
                endpoint: "/api/v1/authentication/user",
                method: "GET",
                onSuccess: (data) => {
                    setUser(data);
                },
                onFailure: (error) => {
                    console.error(error);
                },
            });
            setIsLoading(false);
        }
        fetchUser();
    }, [user, location.pathname]);

    if (isLoading) {
        return <Loader />;
    }

    if (!isLoading && !user && !isOnAuthPage) {
        return <Navigate to="/authentication/login" />;
    }

    if (user && !user.emailVerified && location.pathname !== "/authentication/verify-email") {
        return <Navigate to="/authentication/verify-email" />;
    }

    if (user && user.emailVerified && location.pathname == "/authentication/verify-email") {
        return <Navigate to="/" />;
    }

    if (
        user &&
        user.emailVerified &&
        !user.profileComplete &&
        !location.pathname.includes("/authentication/profile")
    ) {
        return <Navigate to={`/authentication/profile/${user.id}`} />;
    }

    if (
        user &&
        user.emailVerified &&
        user.profileComplete &&
        location.pathname.includes("/authentication/profile")
    ) {
        return <Navigate to="/" />;
    }

    if (user && isOnAuthPage) {
        return <Navigate to="/" />;
    }

    return (
        <AuthenticationContext.Provider value={{ user, setUser, login, signup, logout }}>
            <Outlet />
        </AuthenticationContext.Provider>
    )
}
