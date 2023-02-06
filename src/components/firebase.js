import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBt6BRbBLikCdkDuNp6hlw3D2SVq6uFnbQ",
  authDomain: "groffice-4d952.firebaseapp.com",
  databaseURL: "https://groffice-4d952-default-rtdb.firebaseio.com",
  projectId: "groffice-4d952",
  storageBucket: "groffice-4d952.appspot.com",
  messagingSenderId: "46581289842",
  appId: "1:46581289842:web:a5019af858be8cf8bec3eb",
  measurementId: "G-B0DY24CFGM"
};


const app = initializeApp(firebaseConfig);
// export const db = app.firestore();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;