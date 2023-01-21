import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const useAuth = () => useContext(AuthContext);

export function useSession() {
    const { user, isAuth = Boolean(user) } = useAuth();
    return { user, isAuth };
}