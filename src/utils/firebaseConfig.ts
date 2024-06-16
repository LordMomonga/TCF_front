// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getStorage } from 'firebase/storage';
const firebaseConfig =  {
  apiKey: "AIzaSyCJvvCVwgQMQKoyvQcc8COOIDl2uii5Mpo",
  authDomain: "densha-46f86.firebaseapp.com",
  projectId: "densha-46f86",
  storageBucket: "densha-46f86.appspot.com",
  messagingSenderId: "548457476900",
  appId: "1:548457476900:web:540ccbe21e67957a3d79b1",
  };


// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const storage = getStorage(firebaseApp);
export {
    firebaseApp,
    storage
}