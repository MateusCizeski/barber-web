import React, { createContext, ReactNode, useState } from "react";
import { destroyCookie, setCookie } from "nookies";
import { useRouter  } from "next/router";

import { api } from "@/services/apiClient";

interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>;
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

interface SignUpProps {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        const router = useRouter();
        destroyCookie(null, '@barber.token', { path: '/' });
        router.push('/login');
    }catch(err) {
        console.log("Erro", err)
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;
    const router = useRouter();

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session',{
                email,
                password
            });

            const { id, name, token, subscriptions, endereco } = response.data;

            setCookie(undefined, '@barber.token', token, {
                maxAge: 60 * 60 * 24 * 30, // Expriem em 1 mês
                path: '/'
            });

            setUser({
                id,
                name,
                email,
                endereco,
                subscriptions
            });

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            router.push('/dashboard');
        }
        catch(err) {
            console.log('erro ao entrar', err);
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            });

            router.push('/login');
        }
        catch(err) {
            console.log('erro ao entrar', err);
        }
    }

    async function logoutUser() {
        try {
           destroyCookie(null, '@barber.token', { path: '/' });
           router.push('/login');
           setUser(null);
        }
        catch(err) {
            console.log('erro ao entrar', err);
        }
    }
    
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}