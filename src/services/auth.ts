import api from "./apiClient";

const registerUser = (data: any) => {
    return api.post('/user/signup', data);
}

const loginUser = (data: any) => {
    return api.post('/user/login', data);
}

export {
    registerUser,
    loginUser
}

