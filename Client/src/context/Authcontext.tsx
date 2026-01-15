import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api from "../configs/api";
import { toast } from "react-hot-toast/headless";

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const signup = async (name: string, email: string, password: string) => {
        try {
            const { data } = await api.post('/api/auth/register', { name, email, password });
            if (data.user) {
                setUser(data.user);
                setIsLoggedIn(true);
            }
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error("Signup failed");
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            if (data.user) {
                setUser(data.user);
                setIsLoggedIn(true);
            }
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.error("Login failed");
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
            setUser(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.log(error);
            toast.error("Logout failed");
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/api/auth/verify');
            if (data.user) {
                setUser(data.user);
                setIsLoggedIn(true);
            }
        } catch {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const value: AuthContextProps = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
