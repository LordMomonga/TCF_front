import { getAcademicYear } from "../utils/storage";
import api from "./apiClient";

const createAssessment = (data: any) => {
    return api.post(`/assessment`, data);
}
const createElement = (data: any) => {
    return api.post("/school/element", data);

}
//grap all the expression element 
const selectExpresssionEcrite = () =>{
    return api.get(`/school/elemEcrite`);
}

const selectExpresssionOrale = () =>{
    return api.get(`/school/elemOrale`);
}

//grap all the comprehension test element
const selectComprehensionOrale = () =>{
    return api.get(`/school/select/compo`);
}
const selectComprehensionEcrite = ()=>{
    return api.get(`/school/select/compe`);

}
//gestion de recuperation des solutions des tests de langue 
const setSolutionExpressionEcrite = (data:any) => {
    return api.post('/addEcrit', data);
}

const setSolutionExpressionOrale = (data:any) => {
    return api.post('/addAudio', data)
}
// gestion de la gestion des correction

const getCorrectionStudent = () => {
    return api.get("/getAudio");
}

// gestion des resultat de la comprehension orale et de la comprehension ecrite
const setResultElement = (data:any) => {
    return api.post('/student/type', data)
}

const selectResultat = ()=>{
    return api.get('/student/type');

}


const getCorrectionStudentEcrit = () => {
    return api.get("/getEcrit");
}

const getCorrectionStudentOne = (elementID: any) => {
    return api.get(`/getOne/${elementID}`, elementID);
}

const getCorrectionStudentOneEcrit = (elementID: any) => {
    return api.get(`/getOneEcrit/${elementID}`, elementID);
}

const getEcritAndUpdate = ( data: any) => {
    return api.post(`/getOneEcritAndUpdate`, data);
}


const getAudioAndUpdate = ( data: any) => {
    return api.post('/getOneAndUpdate', data);
}

const getMyResults = ( ) => {
    return api.get(`/student/getOne`);
}

const getMyResultsEcrit = ( ) => {
    return api.get(`/getEcritStudent`);
}
// fin de la gestion des correction vu et afficherpour le correcteur 
// gestion pour les ajouts des test de langues

const CreateTestELement = (data: any) => {
    return api.post(`/school/add/elem`, data);

}
const updateAssessment = (id: any, data: any) => {
    return api.post(`/assessment/${id}`, data);
}

const getAssessments = () => {
    let accademicYear = getAcademicYear();

    return api.get(`/assessments/${accademicYear}`);
}

const getClassAssessments = (classId: any)  => {
    let accademicYear = getAcademicYear();

    return api.get(`/assessments/${classId}/${accademicYear}`);
}

const studentGetAssessments = (classId: any) => {
    return api.get(`/student/assessment/${classId}`);
}

const deleteAssessment = (id: any) => {
    return api.delete(`/assessment/${id}`)
}


const submitAssessmentSolution = (data: any) => {
    let accademicYear = getAcademicYear();

    return api.post(`/student/assessment/${accademicYear}`, data);
} 

const submitAssessmentScore = (assessmentSolId: any, data: any) => {
    return api.post(`/assessment/score/${assessmentSolId}`, data)
}

const getAllAssessmentSolutions = (assessmentId: any) => {
    let accademicYear = getAcademicYear();

    return api.get(`/assessment/solutions/${assessmentId}/${accademicYear}`);
}

const getStudentsAssessmentSolutions = () => {
    let accademicYear = getAcademicYear();

    return api.get(`/student/assessment/solutions/${accademicYear}`);
}

const getTotalAssessments = (classId: any) => {
    return api.get(`/student/total/assessment/${classId}`)
}


export {
    createAssessment,
    getAssessments,
    studentGetAssessments,
    deleteAssessment,
    submitAssessmentSolution,
    getAllAssessmentSolutions,
    getStudentsAssessmentSolutions,
    getTotalAssessments,
    getClassAssessments,
    submitAssessmentScore,
    updateAssessment,
    createElement,
    CreateTestELement,
    selectExpresssionEcrite,
    selectExpresssionOrale,
    selectComprehensionOrale,
    selectComprehensionEcrite,
    setSolutionExpressionEcrite, 
    setSolutionExpressionOrale, 
    getCorrectionStudent,
    getCorrectionStudentOne,
    getCorrectionStudentOneEcrit,
    getCorrectionStudentEcrit,
    getEcritAndUpdate,
    getAudioAndUpdate,
    getMyResults,
    getMyResultsEcrit, 
    setResultElement,
    selectResultat

    
}   

