import { useState } from "react";
import { useFirestore } from "./useFirestore";
import constantes from "../utils/constantes";
import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser, signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth'
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useUsrCiudadanoFirestore = () => {
    const auth = getAuth()
    const { data: dataUsr, error: errorUsr, loading: loadingUsr, getDataDoc, returnGetDataDoc, setDocumentNoState, getBlobFromUri } = useFirestore()
    const { setDocument, deleteDocument } = useFirestore()


    const colUsuariosInfo = constantes.colecciones.usuariosInfo
    const colCiudadanos = constantes.colecciones.ciudadanos

    const getUsuario = async () => {
        getDataDoc(colUsuariosInfo, auth.currentUser.uid)
    }

    const getReturnUsuario = async () => {
        return returnGetDataDoc(colUsuariosInfo, auth.currentUser.uid)
    }

    const iniciarSesionEmailYPass = async (email, password) => {
        try {
            let resultado = null
            let usuarioInfo = null
            let ciudadanoInfo = null

            await signInWithEmailAndPassword(
                auth,
                email,
                password,
            )
            console.log('AUTHfirebase', auth.currentUser)

            resultado = await recuperarDatosDeSesion('useUsrCiudadanoFirestore iniciarSesionEmailYPass')
            /*resultado = {
                email: 'fabian.david.p@gmail.com',
                token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIxZTZjMGM2YjRlMzA5NTI0N2MwNjgwMDAwZTFiNDMxODIzODZkNTAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUExBTkNIT04gRkFCSUFOIERBVklEIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2d1YWxlYWN0aXZhZG9zIiwiYXVkIjoiZ3VhbGVhY3RpdmFkb3MiLCJhdXRoX3RpbWUiOjE2NjM3NjcwMjAsInVzZXJfaWQiOiJZMk5IZDU0cE1BYmZiTE9CNVhNeEFYblVZSVUyIiwic3ViIjoiWTJOSGQ1NHBNQWJmYkxPQjVYTXhBWG5VWUlVMiIsImlhdCI6MTY2Mzc2NzAyMCwiZXhwIjoxNjYzNzcwNjIwLCJlbWFpbCI6ImZwbGFuY2hvbkBndWFsZWd1YXljaHUuZ292LmFyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImZwbGFuY2hvbkBndWFsZWd1YXljaHUuZ292LmFyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.UslsIR28-2BdCV1BbB3EZKJsSvf4gtr5knTRHmAdYCk00K8zG_ODV8a5O-d5SwrmXSowd3cvyHDQIlTINLTMo8fOcsduvSwiwJHBCdK1AqQ7odY4lm2Y-BPhsjs_X8ikzpgMGK2-ET8GK4mHxbYr9Msqh1DlV0rbJMkOXFv_91zH6IOvwyZSWBBWJj4P0W1xAafZtNpai6207PMNDF6J3svBhK0gXKpLy-vvrPRExJjhZryxutDrJk4CIV561S8nMaS5soRnzre9xNVMS3wF6CX8A1Go5LmVskuAz-Ms-gRiHds_O2saR4e4fXGb86ifWLNBjjJbRqI739yQiVmQsw',
                usuarioInfo: {},
                typeLogin: 'firebase'
            }*/
            return resultado
        } catch (error) {
            console.log('error desde useUsrCiudadanoFirestore iniciarSesionEmailYPass', error)
            throw error
        }
    }

    const recuperarDatosDeSesion = async (desde = 'no indicado') => {
        try {
            let resultado = null
            let usuarioInfo = null
            let ciudadanoInfo = null
            //const authh = getAuth()
            //console.log('authh', authh)
            //console.log('uid', authh.currentUser.uid)
            if (auth.currentUser) {

                usuarioInfo = await returnGetDataDoc(colUsuariosInfo, auth.currentUser.uid)
                console.log('usuarioInfo', usuarioInfo)

                ciudadanoInfo = await returnGetDataDoc(colCiudadanos, usuarioInfo.id_ciudadano)
                //console.log('ciudadanoInfo', ciudadanoInfo)

                usuarioInfo = { ...usuarioInfo, ...ciudadanoInfo }

                resultado = {
                    email: ciudadanoInfo.email,
                    token: auth.currentUser.stsTokenManager.accessToken,
                    usuarioInfo: usuarioInfo,
                    typeLogin: 'firebase'
                }
            }

            return resultado
        } catch (error) {
            console.log('error desde useUsrCiudadanoFirestore recuperarDatosDeSesion, llamado desde ' + desde + ': ', error)
            throw error
        }
    }

    const crearUsuarioEmailYPassConCiudadano = async (email, password, PimUsuario) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    sendEmailVerification(auth.currentUser)
                        .then(() => {
                            console.log('Email conf enviado')
                        });
                })
                .catch((error) => {
                    console.log('error desde useUsrCiudadanoFirestore.js createUserWithEmailAndPassword', error);
                    throw error
                });


            await updateProfileAuth(PimUsuario.nombres)

            await setUsuarioFirestore(PimUsuario.id_ciudadano)

            await setCiudadanoFirestore(PimUsuario)



        } catch (error) {
            cerrarSesionAuth()
            console.log('error desde useUsrCiudadanoFirestore.js crearUsuarioEmailYPassConCiudadano', error)
            throw error
        }
    }

    const cerrarSesionAuth = () => {
        signOut(auth)
    }

    const eliminarUsuarioEnAuthYFirestore = async () => {
        try {
            const uid = getAuth().currentUser.uid
            await deleteUser(getAuth().currentUser)
            await deleteDocument(colUsuariosInfo, uid)
        } catch (error) {
            console.log('error desde useUsrCiudadanoFirestore.js eliminarUsuarioEnAuthYFirestore', error)
            throw error
        }
    }

    const setUsuarioFirestore = async (id_ciudadano) => {
        await setDocumentNoState(colUsuariosInfo, getAuth().currentUser.uid, {
            'id_ciudadano': id_ciudadano,
        }).then(() => {

        }).catch((error) => {
            console.log('setDocument setUsuarioFirestore: ', error);
            throw error
        });
    }

    const setCiudadanoFirestore = async (PimUsuario) => {
        let datos = {};
        if (PimUsuario.nombres) { datos['nombres'] = PimUsuario.nombres }
        if (PimUsuario.apellido) { datos['apellido'] = PimUsuario.apellido }
        if (PimUsuario.cuitcuil) { datos['cuitcuil'] = PimUsuario.cuitcuil }
        if (PimUsuario.email) { datos['email'] = PimUsuario.email }
        await setDocumentNoState(colCiudadanos, PimUsuario.id_ciudadano, datos).then(() => {

        }).catch((error) => {
            console.log('setDocument setCiudadanoFirestore: ', error);
            throw error
        });
    }

    const updateProfileAuth = async (nombres) => {
        await updateProfile(getAuth().currentUser, { displayName: nombres }).then(() => {
            // Profile updated!            
            // ...
        }).catch((error) => {
            console.log('error updateProfileAuth', error);
            throw error
        });
    }

    const updateProfileFirestore = async (datos, PimUsuario) => {
        await setDocument(colCiudadanos, PimUsuario, datos).then(res => {
            if (datos.phone != null) {
                console.log('seteando celular', datos.phone)
                AsyncStorage.setItem('numeroCelular', datos.phone)
            }

            // console.log('Respuesta updateProfileFirestore setDocument', res)
        }).catch((error) => {
            console.log('error updateProfileFirestore', error);
            throw error
        });
    };

    const getURIToBlob = async (uri) => {
        return await getBlobFromUri(uri)
    };


    const uploadImageStorageAndSync = async (fileBlob, PimUsuario) => {
        const imgName = "photoUrl-" + auth.currentUser.uid;
        // Crear referencia al cloud storage
        const storage = getStorage();
        // Crear referencia a la imagen a subir
        const refPhotoUrl = `images/photoUrl/${imgName}.jpg`
        const storageRef = ref(storage, refPhotoUrl);

        console.log("Subiendo imagen", imgName);
        uploadBytes(storageRef, fileBlob).then(async (snapshot) => {
            // Referencia en firestore en el doc del usuario
            await setDocument(colCiudadanos, PimUsuario, { photoUrl: snapshot.metadata.fullPath })
                .then(res => {
                    console.log('Respuesta uploadImageStorageAndSync uploadBytes setDocument', res)
                }).catch((error) => {
                    console.log('error setDocument', error);
                    throw error
                });

            // Obtiene el enlace de la imagen subida y actualiza el perfil.
            const imgUrl = await getDownloadURL(ref(storage, refPhotoUrl))
            await updateProfile(auth.currentUser, { photoURL: imgUrl })
        });
    };


    return {
        dataUsr,
        errorUsr,
        loadingUsr,
        getUsuario,
        iniciarSesionEmailYPass,
        getReturnUsuario,
        crearUsuarioEmailYPassConCiudadano,
        eliminarUsuarioEnAuthYFirestore,
        cerrarSesionAuth,
        updateProfileAuth,
        setUsuarioFirestore,
        setCiudadanoFirestore,
        recuperarDatosDeSesion,
        returnGetDataDoc,
        updateProfileFirestore,
        getURIToBlob,
        uploadImageStorageAndSync
    }
}