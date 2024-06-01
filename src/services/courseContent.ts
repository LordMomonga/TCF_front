import { getAcademicYear } from "../utils/storage";
import api from "./apiClient";

const createCourseContent = (data: any) => {
    return api.post('/course-content', data);
}

const getCourseContents = () => {
    let accademicYear = getAcademicYear();

    return api.get(`/course-contents/${accademicYear}`);
}

const getClassCourseContents = (classId: string) => {
    let accademicYear = getAcademicYear();
  
    return api.get(`/course-contents/class/${classId}/${accademicYear}`);
}

const deleteCourseContent = (id: any) => {
    return api.delete(`/course-content/${id}`)
}

const submitStudentFollowUpScore = (data: any, solutionId: any) => {
    return api.post(`/followup/score/${solutionId}`, data);
}

export {
    createCourseContent,
    getCourseContents,
    getClassCourseContents,
    deleteCourseContent,
    submitStudentFollowUpScore
}
