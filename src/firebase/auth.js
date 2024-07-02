import {initializeApp} from 'firebase/app'
import FirebaseConfig from './firebase-config.js'
import { getAuth, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"

const app = initializeApp(FirebaseConfig)
const auth = getAuth(app)

export function loginWithEmail(email, password){
    return signInWithEmailAndPassword(auth, email, password)
}

export function logout(){
    return signOut(auth)
}

export function observeAuthState(callback){
    return onAuthStateChanged(auth, callback)
}

export function signUp(email, password){
    return createUserWithEmailAndPassword(auth, email, password)
}

