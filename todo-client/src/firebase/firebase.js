import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDkQHHy4VNO89CDac0NR4of9ygZ2UajtB0",
  authDomain: "todo-notes-login.firebaseapp.com",
  projectId: "todo-notes-login",
  storageBucket: "todo-notes-login.firebasestorage.app",
  messagingSenderId: "1040536779224",
  appId: "1:1040536779224:web:997de679bdd3920ec65aad"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();