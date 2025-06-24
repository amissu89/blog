import { initializeApp } from 'firebase/app'
import FirebaseConfig from './firebase-config.js'

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

const app = initializeApp(FirebaseConfig)
const storage = getStorage(app);

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