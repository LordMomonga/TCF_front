import { getAcademicYear } from "../utils/storage";
import api from "./apiClient";

const schoolCreateBankInfo = (data: any) => {
    return api.post('/school/bank-info', data);
}

const schoolGetBankInfos= () => {
    return api.get('/school/bank-infos');
}

const studentGetBankInfos= () => {
    let academicYear = getAcademicYear();

    return api.get(`/student/bank-infos/${academicYear}`);
}

const schoolUpdateBankInfos= (id:any, data: any) => {
    return api.post(`/school/bank-info/${id}`, data);
}

const schoolDeleteBankInfo= (id: any) => {
    return api.delete(`/school/bank-info/${id}`);
}


export {
    schoolCreateBankInfo,
    schoolGetBankInfos,
    schoolUpdateBankInfos,
    schoolDeleteBankInfo,
    studentGetBankInfos
}
