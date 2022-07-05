import { useState } from 'react'
import { setDoc, getDoc, doc, collection, addDoc, getDocs, where, query, deleteDoc } from 'firebase/firestore'
import { dbFirestore } from "../utils"

export const useFirestore = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const getDataColl = async (coleccion, params = false) => {
        try {
            setError(false)
            setLoading(true)
            const Ref = collection(dbFirestore, coleccion)
            let q = null
            if (params) {
                q = query(Ref, ...params)
            } else {
                q = query(Ref)
            }

            const querySnapshot = await getDocs(q)
            const qryData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            setData(qryData)

        } catch (error) {
            console.log('error Firestore getDataColl: ', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const getDataDoc = async (coleccion, id) => {
        try {
            setError(false)
            setLoading(true)
            const Ref = doc(dbFirestore, coleccion, id)
            const docSnap = await getDoc(Ref)
            //console.log(docSnap)
            if (docSnap.exists()) {
                //console.log(docSnap)
                const qryData = docSnap.data()
                setData(qryData)
            } else {
                setData(null)
            }

        } catch (error) {
            console.log('error getDataDoc Firestore: ', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const returnGetDataDoc = async (coleccion, id) => {
        try {
            setLoading(true)

            console.log('returnGetDataDoc con:', coleccion, id)

            // id = id.toSting()
            if (!isNaN(id)) {
                id = id.toString()
            }

            const Ref = doc(dbFirestore, coleccion, id)
            const docSnap = await getDoc(Ref)
            //console.log(docSnap)
            if (docSnap.exists()) {
                //console.log(docSnap)
                const qryData = docSnap.data()
                return qryData
            } else {
                return null
            }

        } catch (error) {
            console.log('error returnGetDataDoc Firestore: ', error)
            throw error.message
        } finally {
            setLoading(false)
        }
    }

    const setDocument = async (coleccion, id, datos, mergear = true) => {
        try {
            setError(false)
            setLoading(true)
            const Ref = doc(dbFirestore, coleccion, id)
            await setDoc(Ref, datos, { merge: mergear })
            setData(true)
        } catch (error) {
            console.log('error setDocument Firestore: ', error)
            setData(false)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const setDocumentNoState = async (coleccion, id, datos, mergear = true) => {
        try {
            const Ref = doc(dbFirestore, coleccion, id)
            await setDoc(Ref, datos, { merge: mergear })
        } catch (error) {
            console.log('error setDocumentNoState Firestore: ', error)
            throw error
        }
    }

    const deleteDocument = async (coleccion, id) => {
        try {
            setError(false)
            setLoading(true)
            await deleteDoc(doc(dbFirestore, coleccion, id));
            setData(true)
        } catch (error) {
            console.log('error deleteDocument Firestore: ', error)
            setData(false)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    /*  Obtener datos binarios de imágenes cargables. */
    const getBlobFromUri = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                resolve(xhr.response);
            };
                xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        
        return blob;
    };

    return {
        data, error, loading, getDataColl, getDataDoc, setDocument, deleteDocument, returnGetDataDoc, setDocumentNoState, getBlobFromUri
    }
}