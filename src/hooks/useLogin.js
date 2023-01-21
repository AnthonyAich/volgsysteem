import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

const useAuth = () => useContext(AuthContext);

export function useLogin() {
    const { login, error, loading, setError, register } = useAuth();
    return { login, error, loading, setError, register };
}