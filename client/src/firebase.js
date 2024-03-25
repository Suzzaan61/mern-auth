// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBAE_API_KEY,
    authDomain: "mern-auth-a0747.firebaseapp.com",
    projectId: "mern-auth-a0747",
    storageBucket: "mern-auth-a0747.appspot.com",
    messagingSenderId: "650212085586",
    appId: "1:650212085586:web:6065469949e9c5706e748b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);