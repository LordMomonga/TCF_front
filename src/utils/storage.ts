import jwtDecode from 'jwt-decode';

const key = "authToken";

const storeToken  =  (authToken: string) => {
    try {
        localStorage.setItem(key, authToken);
    } catch (error) {
        console.log("Error storing auth token", error)
    }
}

const getToken = () => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.log("Error getting the auth token", error)
    }
}

const storeAcademicYear = (yearId: string) => {
    try {
        localStorage.setItem('academic_year_id', yearId);
    } catch (error) {
        console.log('ERROR SAVING CODE');
    }
}

const getAcademicYear = () => {
    try {
        return localStorage.getItem('academic_year_id');
    } catch (error) {
        console.log('ERROR SAVING CODE');
    }
}

const getUser = () => {
    const token: any =  getToken();
    // console.log('STUDENT DATA: ', jwtDecode(token));

    return token ? jwtDecode(token) : null;
}

const isTeacher = () => {
    const token: any =  getToken();
    let user:any = jwtDecode(token);
    // console.log('USER IN ISCHECK',  user)
    return user?.role == 'teacher' ? true : false;
}

const isStudent = () => {
    const token: any =  getToken();
    let user:any = jwtDecode(token);
    // console.log('USER IN ISCHECK',  user)
    return user?.role == 'student' ? true : false;
}
const isUser = () => {
    const token: any =  getToken();
    let user:any = jwtDecode(token);
    // console.log('USER IN ISCHECK',  user)
    return user?.role == 'user' ? true : false;
}
const isAdmin = () => {
    const token: any =  getToken();
    let user:any = jwtDecode(token);
    // console.log('USER IN ISCHECK',  user)
    return user?.role == 'Admin' ? true : false;
}

const removeToken =  ()=> {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.log("Error removing auth token", error);
    }
}

const removeAcademicYear = () => {
    try {
        localStorage.removeItem('academic_year_id')
    } catch (error) {
        console.log('Error removing data', error)
    }
}


export { getUser, getToken, removeAcademicYear, removeToken, isAdmin, storeToken, isTeacher, isStudent,isUser, storeAcademicYear, getAcademicYear }

