import React, { createContext, ReactNode, useState } from "react";
import { destroyCookie } from "nookies";
import { Router } from "next/router";

interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
}

interface UserProps {
    id: string;
    name: string;
    email: string;
    endereco: string | null;
    subscriptions?: SubscriptionProps | null; 
}

interface SubscriptionProps {
    id: string;
    status: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

interface SignInProps {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(null, '@barber.token', { path: '/' });
        Router.push('/login');
    }catch(err) {
        console.log("Erro", err)
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps) {

    }
    
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}