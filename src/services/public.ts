import api from "./apiClient";


const getPublicSchools = () => {
    return api.get(`/public/schools`);
}

const getPublicSpecialities= (id: any) => {
    return api.get(`/public/specialites/${id}`);
}


export {
    getPublicSchools,
    getPublicSpecialities
}
