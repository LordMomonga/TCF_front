import { getAcademicYear } from "../utils/storage";
import api from "./apiClient";

const getStudentsClasses = () => {
    return api.get('/applications/student');
}

const getAcceptedClasses = () => {
    let academicYear = getAcademicYear();

    return api.get(`/student/classes/${academicYear}`);
}

const joinClass = (data: any) => {
    return api.post('/applications', data);
}

const joinSchool = (data: any) => {
    return api.post('/school/students/apply', data);
}

const getStudentApplications = () => {
    return api.get(`/student/applications`);
}

const getCourseContent = (id: any) =>  {
    let academicYear = getAcademicYear();

    return api.get(`/course-contents/student/${id}/${academicYear}`);
}

const getStudentTimetables = () => {
    let academicYear = getAcademicYear();

    return api.get(`/student/timetables/${academicYear}`);
}

const getStudentAnnouncements = () => {
    let academicYear = getAcademicYear();

    return api.get(`/student/announcements/${academicYear}`);
}

const getStudentReports = () => {
    let academicYear = getAcademicYear();

    return api.get(`/student/reports/${academicYear}`);
}

const createReport = (data: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/student/report/${academicYear}`, data);
}

const submitStudentReceipt = (data: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/student/receipt/${academicYear}`, data);
}


const studentGetReceipts = () => {
    let academicYear = getAcademicYear();

    return api.get(`/student/receipts/${academicYear}`);
}




const submitFollowupSolution = (data: any) => {
    let academicYear = getAcademicYear();
    
    return api.post(`/followup/solution/${academicYear}`, data);
}

const getStudentSolutions = () => {
    let academicYear = getAcademicYear();

    return api.get(`/followup/student/solutions/${academicYear}`);
}

const getAllStudentSolutions = (courseContentId: any) => {
 
    return api.get(`/followup/solutions/${courseContentId}`)
}

const studentGetPassExams = (classId: any) => {
    return api.get(`/students/passexams/${classId}`);
}

// ACADEMIC YEARS
const studentGetAcademicYears = () => {
    return  api.get('/students/academic-years');
}


// SCHOOOL
const schoolGetStudents = () => {
    let academicYear = getAcademicYear();

    return api.get(`/school/students/${academicYear}`);
}

const schoolAcceptStudent = (studId: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/school/student/accept/${studId}/${academicYear}`, {status: 'accepted'});
}

const schoolRejectStudent = (studId: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/school/student/reject/${studId}/${academicYear}`, {status: 'rejected'});
}

const schoolSuspendStudent = (studId: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/school/student/suspend/${studId}/${academicYear}`, {status: 'suspended'});
}

export {
    getStudentsClasses,
    joinClass,
    getCourseContent,
    getAcceptedClasses,
    getStudentSolutions,
    submitFollowupSolution,
    getAllStudentSolutions,
    studentGetPassExams,
    schoolGetStudents,
    schoolAcceptStudent,
    schoolRejectStudent,
    schoolSuspendStudent,
    joinSchool,
    getStudentApplications,
    studentGetAcademicYears,
    getStudentTimetables,
    getStudentAnnouncements,
    createReport,
    getStudentReports,
    submitStudentReceipt,
    studentGetReceipts
}


