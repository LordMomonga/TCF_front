import  { create } from 'apisauce';
import { getToken } from '../utils/storage';
const apiUrlTest  = 'http://localhost:8070';
const  apiUrlLive  =  'https://tolkin-chi.vercel.app/';

const api =  create({ 
    baseURL: apiUrlLive,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

api.addAsyncRequestTransform(async (request: any) => {
   const authToken = getToken();
   if(!authToken) return;
   request.headers['x-access-token'] = authToken;
})

export default api;
