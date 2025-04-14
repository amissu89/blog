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