import api from "./apiClient";
import { getAcademicYear } from "../utils/storage";

const createSession = (data: any) => {
    return api.post(`/session/create`, data);
}


const endSession = (data: any) => {
    console.log('DATA: end: ', data);
    return api.post(`/session/end`, data);
}

const getAllSessions= () => {
    let accademicYear = getAcademicYear();
    
    return api.get(`/sessions/${accademicYear}`);
}

const studentsGetAllSessions= () => {
    let accademicYear = getAcademicYear();
    
    return api.get(`/student/live-sessions/${accademicYear}`);
}

const joinSession = (data: any) => {
    return api.post('/session/join', data);
}


export {
    createSession,
    endSession,
    getAllSessions,
    joinSession,
    studentsGetAllSessions
}
