// axios
import { axios } from ".";

export const login = (email, password) => {
    return axios.post("/login", { email, password });
};

// register{firstName, lastName, email, password, role} post
export const register = (firstName, lastName, email, password, role) => {
    return axios.post("/login/register", { firstName, lastName, email, password, role });
};