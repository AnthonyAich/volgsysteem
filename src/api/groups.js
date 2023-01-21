import { axios } from '.';

//get groups
export const getMyGroups = async () => {
    return await axios.get("/groups/getMyGroups");
};

//get group by id
export const getGroupById = async (id) => {
    return await axios.get(`/groups/getById/${id}`);
}

//get group users by id
export const getGroupUsersById = async (id) => {
    return await axios.get(`/groups/getUsersByGroupId/${id}`);
}

export const addUsersCsvToGroup = async (id, file) => {
    return await axios.post(`/groups/addUsersCsvToGroup/${id}`, file);
}

export const deleteStudentFromGroup = async (groupId, studentId) => {
    return await axios.get(`/groups/deleteStudentFromGroup/${groupId}/${studentId}`);
}

// add group
export const addGroup = async (groupName) => {
    return await axios.post("/groups/add", { groupName });
};

// delete group
export const deleteGroup = async (id) => {
    return await axios.post("/groups/deleteGroup/", { id: id });
}

// searchGroepByName {name} post
export const searchGroepByName = async (name) => {
    return await axios.post("/groups/searchGroepByName", { name: name });
};