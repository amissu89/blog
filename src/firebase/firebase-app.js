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
import logger from '../utils/logger.js'

const app = initializeApp(FirebaseConfig)
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app)

/**
 * Sign in with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<import('firebase/auth').UserCredential>} User credential
 */
export function loginWithEmail(email, password){
    return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export function logout(){
    return signOut(auth)
}

/**
 * Observe authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export function observeAuthState(callback){
    return onAuthStateChanged(auth, callback)
}

/**
 * Create a new user account with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<import('firebase/auth').UserCredential>} User credential
 */
export function signUp(email, password){
    return createUserWithEmailAndPassword(auth, email, password)
}


/**
 * Upload a file to Firebase Storage
 * @param {string} storageName - The path where the file should be stored
 * @param {Blob|File} file - The file to upload
 * @returns {Promise<import('firebase/storage').UploadResult>} Upload snapshot
 */
export async function uploadFile(storageName, file){
    logger.debug('Uploading file:', storageName)
    const storageRef = ref(storage, storageName)

    try{
        const snapshot = await uploadBytes(storageRef, file)
        logger.info('File uploaded successfully:', snapshot.ref.fullPath);
        return snapshot;
    } catch (error) {
        logger.error(`Error uploading file: ${storageName}`, error);
        throw error;
    }
}

/**
 * Get download URL for a file in Firebase Storage
 * @param {string} fullPathFileName - Full path to the file in storage
 * @returns {Promise<string>} Download URL
 */
export async function getUrl(fullPathFileName){
    try {
        const url = await getDownloadURL(ref(storage, fullPathFileName));
        logger.debug('Retrieved download URL for:', fullPathFileName);
        return url;
    } catch (error) {
        logger.error(`Error retrieving URL for file: ${fullPathFileName}`, error);
        throw error;
    }
}

/**
 * Delete multiple files from Firebase Storage
 * @param {string[]} paths - Array of file paths to delete
 * @returns {Promise<{success: boolean, deletedCount: number, errors: Array}>} Result of deletion operation
 */
export async function deleteFiles(paths){
    logger.debug('Deleting files:', paths)
    const deletePromises = paths.map(async (path) => {
        const fileRef = ref(storage, path);
        try {
            await deleteObject(fileRef);
            return { success: true, path };
        } catch (error) {
            logger.error(`Failed to delete file: ${path}`, error);
            return { success: false, path, error: error.message };
        }
    });

    try {
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(r => r.success).length;
        const errors = results.filter(r => !r.success);

        if (errors.length === 0) {
            logger.info(`All ${successCount} files deleted successfully`);
        } else {
            logger.warn(`Deleted ${successCount}/${paths.length} files. ${errors.length} failed.`);
        }

        return {
            success: errors.length === 0,
            deletedCount: successCount,
            totalCount: paths.length,
            errors
        };
    } catch (error) {
        logger.error('An error occurred while deleting files:', error);
        throw error;
    }
}

/**
 * Add a new document to a Firestore collection with auto-generated ID
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Document data to add
 * @returns {Promise<string>} The auto-generated document ID
 */
export async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        logger.info("Document written with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        logger.error('Error adding document:', error);
        throw error;
    }
}

/**
 * Set a document in Firestore with a specific ID (creates or overwrites)
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document
 * @param {Object} data - Document data to set
 * @param {Object} options - Options (e.g., { merge: true })
 * @returns {Promise<void>}
 */
export async function setDocument(collectionName, documentId, data, options = {}) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await setDoc(docRef, data, options);
        logger.info('Document successfully set');
    } catch (error) {
        logger.error('Error setting document:', error);
        throw error;
    }
}

/**
 * Get a Firestore collection reference
 * @param {string} collectionName - Name of the collection
 * @returns {import('firebase/firestore').CollectionReference} Collection reference
 */
export function getCollection(collectionName) {
    return collection(db, collectionName);
}

/**
 * Get and increment a counter field atomically
 * @param {string} fieldName - Name of the counter field
 * @returns {Promise<number>} Current count before increment (-1 if document doesn't exist)
 */
export async function getCount(fieldName) {
    try {
        const snapshot = await getDocument(Constant.NEXT_NUMBER, Constant.NEXT_ID);
        if (!snapshot.exists()) {
            logger.warn(`Document does not exist for collection: ${Constant.NEXT_NUMBER}, ID: ${Constant.NEXT_ID}`);
            return -1;
        }

        const originalItem = snapshot.data();
        const count = originalItem[fieldName];
        const newItem = { ...originalItem, [fieldName]: count + 1 };

        await updateDocument(Constant.NEXT_NUMBER, Constant.NEXT_ID, newItem);
        return count;
    } catch (error) {
        logger.error('Error getting count:', error);
        throw error;
    }
}

/**
 * Get a single document from Firestore
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document
 * @returns {Promise<import('firebase/firestore').DocumentSnapshot>} Document snapshot
 */
export async function getDocument(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnapshot = await getDoc(docRef);
        return docSnapshot;
    } catch (error) {
        logger.error(`Error getting document from collection: ${collectionName}, ID: ${documentId}`, error);
        throw error;
    }
}

/**
 * Get all documents from a collection reference
 * @param {import('firebase/firestore').CollectionReference} collectionRef - Collection reference
 * @returns {Promise<import('firebase/firestore').QuerySnapshot>} Query snapshot
 */
export async function getAllDocumentsInCollection(collectionRef) {
    try {
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot;
    } catch (error) {
        logger.error(`Error getting documents from collection: ${collectionRef}`, error);
        throw error;
    }
}

/**
 * Get all documents from a collection as an array of objects
 * @param {string} collectionPath - Path to the collection (supports subcollections like 'users/owner/holdings')
 * @returns {Promise<Array<{id: string, ...}>} Array of documents with IDs
 */
export async function getDocuments(collectionPath) {
    try {
        // 경로를 '/'로 분리하여 collection 함수에 전달
        const pathSegments = collectionPath.split('/');
        const collectionRef = collection(db, ...pathSegments);
        const querySnapshot = await getDocs(collectionRef);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        logger.error(`Error getting documents from collection: ${collectionPath}`, error);
        throw error;
    }
}

/**
 * Execute a Firestore query and return the snapshot
 * @param {import('firebase/firestore').Query} query - Firestore query object
 * @returns {Promise<import('firebase/firestore').QuerySnapshot>} Query snapshot
 */
export async function getDocumentsByQuery(query) {
    try {
        const querySnapshot = await getDocs(query);
        return querySnapshot;
    } catch (error) {
        logger.error('Error getting documents by query:', error);
        throw error;
    }
}

/**
 * Build a query with a where condition
 * Note: This returns a query object, not results. Use getDocumentsByQuery() to execute.
 * @param {CollectionReference} collectionRef - Firestore collection reference
 * @param {string} field - Field to filter on
 * @param {string} operator - Comparison operator (==, !=, <, <=, >, >=, in, etc.)
 * @param {any} value - Value to compare against
 * @returns {Query} Firestore query object (not executed)
 */
export function buildQueryWithCondition(collectionRef, field, operator, value) {
    return query(collectionRef, where(field, operator, value));
}

/**
 * Build a query with ordering
 * Note: This returns a query object, not results. Use getDocumentsByQuery() to execute.
 * @param {CollectionReference} collectionRef - Firestore collection reference
 * @param {string} field - Field to order by
 * @param {string} order - Order direction ('asc' or 'desc')
 * @returns {Query} Firestore query object (not executed)
 */
export function buildQueryWithOrdering(collectionRef, field, order) {
    return query(collectionRef, orderBy(field, order));
}

// Deprecated: Use buildQueryWithCondition instead
export function getDocumentsByCondition(collectionRef, field, operator, value) {
    logger.warn('getDocumentsByCondition is deprecated. Use buildQueryWithCondition instead.');
    return buildQueryWithCondition(collectionRef, field, operator, value);
}

// Deprecated: Use buildQueryWithOrdering instead
export function getDocumentsByOrdering(collectionRef, field, order) {
    logger.warn('getDocumentsByOrdering is deprecated. Use buildQueryWithOrdering instead.');
    return buildQueryWithOrdering(collectionRef, field, order);
}

/**
 * Execute a query with a where condition and return results
 * @param {CollectionReference} collectionRef - Firestore collection reference
 * @param {string} field - Field to filter on
 * @param {string} operator - Comparison operator
 * @param {any} value - Value to compare against
 * @returns {Promise<Array>} Array of documents with id and data
 */
export async function queryDocumentsByCondition(collectionRef, field, operator, value) {
    try {
        const q = buildQueryWithCondition(collectionRef, field, operator, value);
        const querySnapshot = await getDocs(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        logger.error('Error querying documents by condition:', error);
        throw error;
    }
}

/**
 * Execute a query with ordering and return results
 * @param {CollectionReference} collectionRef - Firestore collection reference
 * @param {string} field - Field to order by
 * @param {string} order - Order direction ('asc' or 'desc')
 * @returns {Promise<Array>} Array of documents with id and data
 */
export async function queryDocumentsByOrdering(collectionRef, field, order) {
    try {
        const q = buildQueryWithOrdering(collectionRef, field, order);
        const querySnapshot = await getDocs(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        logger.error('Error querying documents by ordering:', error);
        throw error;
    }
}

/**
 * Update an existing document in Firestore
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document to update
 * @param {Object} newValue - Object containing fields to update
 * @returns {Promise<void>}
 */
export async function updateDocument(collectionName, documentId, newValue) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, newValue);
        logger.info('Document successfully updated');
    } catch (error) {
        logger.error('Error updating document:', error);
        throw error;
    }
}

/**
 * Delete a document from Firestore
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document to delete
 * @returns {Promise<void>}
 */
export async function deleteDocument(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
        logger.info('Document successfully deleted');
    } catch (error) {
        logger.error('Error deleting document:', error);
        throw error;
    }
}