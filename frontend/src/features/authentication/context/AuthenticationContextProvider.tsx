import { Dispatch, createContext, useContext, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";

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
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
        } else {
            const { message } = await response.json();
            throw new Error(message);
        }
    };

    const signup = async (email: string, password: string) => {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
        } else {
            const { message } = await response.json();
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }


    useEffect(() => {
        if (user) {
            return;
        }
        fetchUser();
    }, [user, location.pathname]);

    const fetchUser = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Authentication Failed");
            }
            const user = await response.json();
            setUser(user);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

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
        console.log("here1");
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
        console.log("here2");
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