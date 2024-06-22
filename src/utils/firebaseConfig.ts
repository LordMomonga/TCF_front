// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getStorage } from 'firebase/storage';

const firebaseConfig =  {
  apiKey: "AIzaSyB1MeHxCNQFoh2k2rmfJwqMC12n8RJS7Ew",

  authDomain: "tolkin-a2189.firebaseapp.com",

  projectId: "tolkin-a2189",

  storageBucket: "tolkin-a2189.appspot.com",

  messagingSenderId: "945910981310",

  appId: "1:945910981310:web:68a23643bdd6a47fa8f4ef"
  };


// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(firebaseApp);
export {
    firebaseApp,
    storage
}