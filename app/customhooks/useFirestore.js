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
            console.log(docSnap)
            if (docSnap.exists()) {
                console.log(docSnap)
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

    return {
        data, error, loading, getDataColl, getDataDoc, setDocument, deleteDocument
    }
}