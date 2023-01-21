import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";
import * as userApi from "../api/users";
import * as authApi from "../api/auth";

// Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState("");
    const [ready, setReady] = useState(false);

    //login function
    const login = useCallback(async (email, password) => {
        try {
            setLoading(true);
            setError('');
            const { data } = await authApi.login(email, password);
            setUser(data);
            setReady(true);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const setSession = useCallback(async () => {
        try {

            const { data } = await userApi.getMyself();
            if (data === "Unauthorized") {
                setUser("");
                setReady(false);
                const logout = await userApi.logout();
            } else {
                setUser(data);
                setReady(true);
            }
        } catch (error) {
            setError(error);
        }
    }, []);

    const register = useCallback(async (firstName, lastName, email, password, role) => {
        try {
            setLoading(true);
            setError('');
            const { data } = await authApi.register(firstName, lastName, email, password, role);
            setUser(data);
            setReady(true);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);


    // logout function
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            setUser("");
            setReady(false);
            const data = await userApi.logout();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);
    // every rerender
    useEffect(() => {
        setSession();
    }, [setSession]);

    // Provider values
    const value = useMemo(() => {
        return {
            user, setUser, login, logout, register, loading, error, ready
        }
    }, [user, setUser, login, logout, register, loading, error, ready]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


