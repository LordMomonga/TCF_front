import { getAcademicYear } from "../utils/storage";
import api from "./apiClient";

const schoolGetAcceptedStudents = () => {
    let academicYear = getAcademicYear();

    return api.get(`/school/students/all/${academicYear}`);
}

const schoolAcceptTeachersRequest = (id: any) => {
    // alert(id);
    return api.post(`/school/teacher/accept/${id}`, {status: 'accepted'})
}

const schoolRejectTeachersRequest = (id: any) => {
    return api.post(`/school/teacher/reject/${id}`, {status: 'rejected'});
}

const schoolGetAcceptedTeachers = () => {
    return api.get('/school/teachers/all');
}

const schooolGetReceipts = () => {
    let academicYear = getAcademicYear();

    return api.get(`/school/receipts/${academicYear}`);
}

const schooolAcceptReceipts = (id: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/school/accept-receipts/${academicYear}/${id}`, {});
}

const schooolRejectReceipts = (id: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/school/reject-receipts/${academicYear}/${id}`, {});
}

const schoolCreateTimetable = (data: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/school/timetable/${academicYear}`, data);
}

const schoolGetAllTimetables = () => {
    let academicYear = getAcademicYear();

    return api.get(`/school/timetables/${academicYear}`);
}

const schoolGetReoports = () => {
    let academicYear = getAcademicYear();

    return api.get(`/school/reports/${academicYear}`);
}

// ANNOUNCEMENT
const schoolCreateAnnouncement = (data: any) => {
    let academicYear = getAcademicYear();

    return api.post(`/school/announcements/${academicYear}`, data);
}

const schoolGetAllAnnouncement = () => {
    let academicYear = getAcademicYear();

    return api.get(`/school/announcements/${academicYear}`);
}

const schoolCreateAcademicYear = (data: any) => {
    return api.post('/school/academic-year', data);
}

const schoolStopAcademicYear = (id: any) => {
    return api.post('/school/stop/academic-year')
}


const schoolGetAcademicYears = () => {
    return  api.get('/school/academic-years');
}


const schoolCreateResultType = (data: any) => {
    return  api.post('/school/result-type', data);
}


const schoolGetResultsTypes = () => {
    return  api.get('/school/result-types');
}


const schoolDeleteResultsTypes = (id: any) => {
    return  api.delete(`/school/result-type/${id}`);
}



export {
    schoolGetAcceptedStudents,
    schoolGetAcceptedTeachers,
    schoolCreateTimetable,
    schoolGetAllTimetables,
    schoolCreateAcademicYear,
    schoolGetAcademicYears,
    schoolStopAcademicYear,
    schoolAcceptTeachersRequest,
    schoolRejectTeachersRequest,
    schoolCreateAnnouncement,
    schoolGetAllAnnouncement,
    schoolGetReoports,
    schooolGetReceipts,
    schooolAcceptReceipts,
    schooolRejectReceipts,
    schoolCreateResultType,
    schoolGetResultsTypes,
    schoolDeleteResultsTypes
}
