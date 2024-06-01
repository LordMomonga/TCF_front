import api from "./apiClient";

const acceptApplication = (id: any) => {
    return api.post(`/applications/accept`, {id: id, status: "accepted"});
}

const rejectApplication = (id: any) => {
    return api.post('/applications/reject', {id: id, status: "rejected"});
}

const getAllApplications = () => {
    return api.get(`/applications`)
}


export {
    acceptApplication,
    rejectApplication,
    getAllApplications
}

