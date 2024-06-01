import api from "./apiClient";


const getPublicSchools = () => {
    return api.get(`/public/schools`);
}

const getPublicSpecialities= () => {
    return api.get(`/public/specialites`);
}


export {
    getPublicSchools,
    getPublicSpecialities
}
