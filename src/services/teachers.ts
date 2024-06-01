import api from "./apiClient";


const teachersGetAcademicYears = () => {
    return  api.get('/teacher/academic-years');
}


export {
    teachersGetAcademicYears
}