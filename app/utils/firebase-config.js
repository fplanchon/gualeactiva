import { initializeApp,getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBHZSz-KQ3NAubR31nZaSnk803UkpeMfdQ",
    authDomain: "gualeactivados.firebaseapp.com",
    projectId: "gualeactivados",
    storageBucket: "gualeactivados.appspot.com",
    messagingSenderId: "265790572597",
    appId: "1:265790572597:web:3a3f0870f3ea13d54f897c",
    measurementId: "G-KPN7EVGMD3"
}

const initFirebase = initializeApp(firebaseConfig)
const auth = getAuth(initFirebase)
const dbFirestore = getFirestore(initFirebase)

export { initFirebase, auth, dbFirestore, getApp }