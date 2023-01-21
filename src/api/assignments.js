import { axios } from '.';

// getOpdrachtenByGroepId (id) get
export const getOpdrachtenByGroepId = async (id) => {
    return await axios.get(`/assignments/getOpdrachtenByGroepId/${id}`);
};

// getDeelOpdrachtById (id) get
export const getDeelOpdrachtById = async (id) => {
    return await axios.get(`/assignments/getDeelOpdrachtById/${id}`);
};

// setStatusOfAssignment (assignment.data.id, status) post
export const setStatusOfAssignment = async (id, status) => {
    return await axios.post(`/assignments/setStatusOfAssignment/`, { id: id, status: status });
};

// /getRapportByUserIdAndDeelOpdrachtId/:deelOpdrachtId
export const getRapportByUserIdAndDeelOpdrachtId = async (deelOpdrachtId) => {
    return await axios.get(`/assignments/getRapportByUserIdAndDeelOpdrachtId/${deelOpdrachtId}`);
};

// setQuestionToRapport {beschrijving, rapportId} post
export const setQuestionToRapport = async (beschrijving, rapportId) => {
    return await axios.post(`/assignments/setQuestionToRapport/`, { beschrijving: beschrijving, rapportId: rapportId });
};

// getMessagesByDeelOpdrachtId {deelOpdrachtId}
export const getMessagesByRapportId = async (rapportId) => {
    return await axios.get(`/assignments/getMessagesByRapportId/${rapportId}`);
};

// askForMoreTime {rapportId, tijd} post
export const askForMoreTime = async (rapportId, tijd) => {
    return await axios.post(`/assignments/askForMoreTime/`, { rapportId: rapportId, tijd: tijd });
}

// deleteDeelOpdrachtById {deelOpdrachtId} post
export const deleteDeelOpdrachtById = async (deelOpdrachtId) => {
    return await axios.post(`/assignments/deleteDeelOpdrachtById/`, { deelOpdrachtId: deelOpdrachtId });
}

// addDeelOpdracht {opdrachtId, beschrijving, tijd} post
export const addDeelOpdracht = async (opdrachtId, beschrijving, tijd) => {
    return await axios.post(`/assignments/addDeelOpdracht/`, { opdrachtId: opdrachtId, beschrijving: beschrijving, tijd: tijd });
}

// addOpdract {groepId, beschrijving} post
export const addOpdracht = async (groepId, beschrijving) => {
    return await axios.post(`/assignments/addOpdracht/`, { groepId: groepId, beschrijving: beschrijving });
}

// deleteOpdrachtById {opdrachtId} post
export const deleteOpdrachtById = async (opdrachtId) => {
    return await axios.post(`/assignments/deleteOpdrachtById/`, { opdrachtId: opdrachtId });
}

// getAllVragenWithOpdrachtElementId {opdrachtElementId} post
export const getAllVragenWithOpdrachtElementId = async (opdrachtElementId) => {
    return await axios.post(`/assignments/getAllVragenWithOpdrachtElementId/`, { opdrachtElementId: opdrachtElementId });
}

// getstatusOfEveryoneInOpdrachtElement {opdrachtElementId} get
export const getstatusOfEveryoneInOpdrachtElement = async (opdrachtElementId) => {
    return await axios.get(`/assignments/getstatusOfEveryoneInOpdrachtElement/${opdrachtElementId}`);
}

// addTimeToOpdrachtElement {opdrachtElementId, time} post
export const addTimeToOpdrachtElement = async (opdrachtElementId, time) => {
    return await axios.post(`/assignments/addTimeToOpdrachtElement/`, { opdrachtElementId: opdrachtElementId, time: time });
}

// getAllRapportenOfOpdrachtElement {opdrachtElementId} post
export const getAllRapportenOfOpdrachtElement = async (opdrachtElementId) => {
    return await axios.post(`/assignments/getAllRapportenOfOpdrachtElement/`, { opdrachtElementId: opdrachtElementId });
}
