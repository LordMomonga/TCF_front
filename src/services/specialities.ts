import api from "./apiClient";


const createSpeciality  = (data: any) => {
    return api.post('/school/speciality', data)
}

const getSchoolSpecialitis = () => {
    return api.get('/school/specialities');
}

const deleteShoolSpeciality = (id: any) => {
    return api.delete(`/school/speciality/${id}`);
} 

export {
    createSpeciality,
    getSchoolSpecialitis,
    deleteShoolSpeciality
}

