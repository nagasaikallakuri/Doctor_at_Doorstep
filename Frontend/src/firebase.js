import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBp91SdfRC7lzepbu0UgkPDcd40KuhV6HQ",
  authDomain: "doctoratdoorstep-905a5.firebaseapp.com",
  projectId: "doctoratdoorstep-905a5",
  storageBucket: "doctoratdoorstep-905a5.appspot.com",
  messagingSenderId: "426662427111",
  appId: "1:426662427111:web:e6cd932ac2e71f625c6542",
  measurementId: "G-BH7CQ4JYS5",
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.firestore();
export default app;
