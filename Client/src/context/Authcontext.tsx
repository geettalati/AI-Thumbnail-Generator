import {  createContext } from "react";
import type { IUser } from "../assets/assets";

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user:IUser;
    setUser: (user: IUser | null) => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    
});

export const Authprovider = ({ children }) => {
    const value = {

    }

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider> 
    )
}