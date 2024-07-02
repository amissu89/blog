import { initializeApp } from 'firebase/app'
import FirebaseConfig from './firebase-config.js'
import Constant from "../constant.js"
import {
    doc, getDoc, addDoc, setDoc, getFirestore,
    collection, getDocs, query, where, orderBy,
    updateDoc, deleteDoc
} from "firebase/firestore";

const app = initializeApp(FirebaseConfig)
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID : ", docRef.id)

        return docRef.id
    } catch (error) {
        console.error('Error adding document : ', error)
        throw error
    }
}

export async function setDocument(collectionName, documentId, data) {
    const docRef = doc(db, collectionName, documentId)

    try {
        await setDoc(docRef, data)
        console.log('Document Set successfully written')
        return
    } catch (error) {
        console.error('Error writing document : ', error)
    }
}

export function getCollection(collectionName) {
    return collection(db, collectionName)
}

export async function getCount(fieldName) {
    const snapshot = await getDocument(Constant.NEXT_NUMBER, Constant.NEXT_ID)
    let count = -1

    //1. count 값 설정
    if (snapshot.exists()) {
        const originalItem = snapshot.data()
        count = originalItem[fieldName]
        const newItem = {
            ...originalItem,
            [fieldName]: count+1,
        };
        updateDocument(Constant.NEXT_NUMBER, Constant.NEXT_ID, newItem)
        
    }
    
    //2. 해당 필드 값 +1
    return count
}

export async function getDocument(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId)
        const docSnapshot = await getDoc(docRef)
        return docSnapshot
    } catch (error) {
        console.error(`Error getting one document from collection: ${collectionName} ID : ${documentId}`, error);
        throw error
    }
}

export async function getAllDocumentsInCollection(collectionRef) {
    try {
        const querySnapshot = await getDocs(collectionRef)
        return querySnapshot
    } catch (error) {
        console.error(`Error getting documents from collection: ${collectionRef}`, error);
        throw error
    }
}
export async function getDocumentsByQuery(query) {
    try {
        const querySnapshot = await getDocs(query)
        return querySnapshot
    } catch (error) {
        console.error(`Error getting documents by Query: ${query}`, error);
        throw error
    }
}

export function getDocumentsByCondition(collectionRef, field, operator, value) {
    const q = query(collectionRef, where(field, operator, value))
    return q
}

export function getDocumentsByOrdering(collectionRef, field, order) {
    const q = query(collectionRef, orderBy(field, order))
    return q
}

export async function updateDocument(collectionName, documentId, newValue) {
    const docRef = doc(db, collectionName, documentId)
    try {
        await updateDoc(docRef, newValue)
        console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}

export async function deleteDocument(collectionName, documentId) {
    const docRef = doc(db, collectionName, documentId)
    try {
        await deleteDoc(docRef)
        console.log('document successfully deleted!')
    } catch (error) {
        console.error('Error deleting document : ', error)
    }
}