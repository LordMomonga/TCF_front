import api from "./apiClient";
import { getAcademicYear } from "../utils/storage";

const getPassExamContents = () => {
    let accademicYear = getAcademicYear();
    return api.get(`/pass-exams/${accademicYear}`);
}

const addPassExamContent = (data: any) => {
    return api.post('/pass-exam', data);
}

const deletePassExamContent = (id: any) => {
    return api.delete(`/pass-exam/${id}`);
}

export {
    getPassExamContents,
    addPassExamContent,
    deletePassExamContent
}