import {initializeApp} from 'firebase/app'
import FirebaseConfig from './firebase-config.js'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import {
    doc, getDoc, addDoc, setDoc, getFirestore,
    collection, getDocs, query, where, orderBy,
    updateDoc, deleteDoc
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"

import Constant from "../constant.js"

const app = initializeApp(FirebaseConfig)
const storage = getStorage(app);
const db = getFirestore(app);
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


export async function uploadFile(storageName, file){
    console.log(storageName)
    const storageRef = ref(storage, storageName)

    try{
        const snapshot = await uploadBytes(storageRef, file)
        console.log('Uploaded a blob or file:', snapshot);
        return snapshot;
    } catch (error) {
        console.error(`Error uploading file: ${storageName}`, error);
        throw error;
      }
}

export async function getUrl(fullPathFileName){
    try {
        const url = await getDownloadURL(ref(storage, fullPathFileName));
        console.log('URL:', url);
        return url;
      } catch (error) {
        console.error(`Error retrieving URL for file: ${fullPathFileName}`, error);
        throw error;
      }
    // return getDownloadURL(ref(storage, fullPathFileName))
    // .then( (url) =>{
    //     console.log('url 22 : ' , url)
    //     return url
    // }).catch((error)=>{
    //     console.error(`Error uploading file: ${fullPathFileName}` , error)
    //     throw error
    // })
}

// export function deleteAttachments(attachmentsList){
//     for(const attachment of attachmentsList){
//         const storageRef = ref(storage, attachment)
//         deleteObject(storageRef).then(()=>{
//             console.log(`${attachment} deleted success`)
//         }).catch( (error)=>{
//             console.error(`${attachment} deleted failed.`, error)
//         })
//     }
// }

// export function deleteStorageFiles(files){
//     for(const thisFile of files){
//         const storageRef = ref(storage, thisFile)
//         deleteObject(storageRef).then(()=>{
//             console.log(`${thisFile} deleted success`)
//         }).catch( (error)=>{
//             console.error(`${thisFile} deleted failed.`, error)
//         })
//     }
// }

export function deleteFiles(paths){
    console.log(paths)
    const res = -1;
    for( const path of paths){
        const fileRef = ref(storage, path)
        deleteObject(fileRef)
        .then(()=> console.log(`${path} deleted successfully`))
        .catch((error) => console.error(`${path} deletion failed`, error))
    }

    return res
}

export async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding document:', error);
        throw error;
    }
}

export async function setDocument(collectionName, documentId, data) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await setDoc(docRef, data);
        console.log('Document successfully set.');
    } catch (error) {
        console.error('Error setting document:', error);
        throw error;
    }
}

export function getCollection(collectionName) {
    return collection(db, collectionName);
}

export async function getCount(fieldName) {
    try {
        const snapshot = await getDocument(Constant.NEXT_NUMBER, Constant.NEXT_ID);
        if (!snapshot.exists()) {
            console.warn(`Document does not exist for collection: ${Constant.NEXT_NUMBER}, ID: ${Constant.NEXT_ID}`);
            return -1;
        }

        const originalItem = snapshot.data();
        const count = originalItem[fieldName];
        const newItem = { ...originalItem, [fieldName]: count + 1 };

        await updateDocument(Constant.NEXT_NUMBER, Constant.NEXT_ID, newItem);
        return count;
    } catch (error) {
        console.error('Error getting count:', error);
        throw error;
    }
}

export async function getDocument(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnapshot = await getDoc(docRef);
        return docSnapshot;
    } catch (error) {
        console.error(`Error getting document from collection: ${collectionName}, ID: ${documentId}`, error);
        throw error;
    }
}

export async function getAllDocumentsInCollection(collectionRef) {
    try {
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot;
    } catch (error) {
        console.error(`Error getting documents from collection: ${collectionRef}`, error);
        throw error;
    }
}

export async function getDocumentsByQuery(query) {
    try {
        const querySnapshot = await getDocs(query);
        return querySnapshot;
    } catch (error) {
        console.error('Error getting documents by query:', error);
        throw error;
    }
}

export function getDocumentsByCondition(collectionRef, field, operator, value) {
    return query(collectionRef, where(field, operator, value));
}

export function getDocumentsByOrdering(collectionRef, field, order) {
    return query(collectionRef, orderBy(field, order));
}

export async function updateDocument(collectionName, documentId, newValue) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, newValue);
        console.log('Document successfully updated.');
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
}

export async function deleteDocument(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
        console.log('Document successfully deleted.');
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}