import { axios } from '.';

//searchUser
export const searchUser = async (username) => {
    return await axios.post("/users/search", { username });
};

//updateUser
export const updateUser = async (user) => {
    return await axios.post("/users/update", { user });
};

export const getUserById = async (id) => {
    return await axios.get(`/users/${id}`);
};

// add 
export const addUser = async (user) => {
    return await axios.post("/users/add", { user });
};

// delete
export const deleteUser = async (id) => {
    return await axios.delete(`/users/${id}`);
}


export const logout = async () => {
    return await axios.post("/login/logout");
}

//getMyself
export const getMyself = async () => {
    return await axios.get("/users/getMyself");
};

// addStudents
export const addStudents = async (csvFile) => {
    return await axios.post("/users/addStudents", { csvFile });
}