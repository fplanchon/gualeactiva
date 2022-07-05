import { useState } from "react";
import { useFirestore } from "./useFirestore";
import constantes from "../utils/constantes";
import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser, signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth'
import { getStorage, getDownloadURL, ref,uploadBytes } from "firebase/storage";

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

            resultado = await recuperarDatosDeSesion()

            return resultado
        } catch (error) {
            console.log('error desde useUsrCiudadanoFirestore iniciarSesionEmailYPass', error)
            throw error
        }
    }

    const recuperarDatosDeSesion = async () => {
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
                console.log('ciudadanoInfo', ciudadanoInfo)

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
            console.log('error desde useUsrCiudadanoFirestore recuperarDatosDeSesion', error)
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
        await setDocumentNoState(colCiudadanos, PimUsuario.id_ciudadano, {
            'nombres': PimUsuario.nombres,
            'apellido': PimUsuario.apellido,
            'cuitcuil': PimUsuario.cuitcuil,
            'email': PimUsuario.email
        }).then(() => {

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
        await setDocument(colCiudadanos,PimUsuario,datos).then(res => {
            console.log('Respuesta',res)
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
        const refPhotoUrl =  `images/photoUrl/${imgName}.jpg`
        const storageRef = ref(storage, refPhotoUrl);

        console.log("Subiendo imagen", imgName);
        uploadBytes(storageRef, fileBlob).then(async (snapshot) => {
            // Referencia en firestore en el doc del usuario
            await setDocument(colCiudadanos,PimUsuario,{ photoUrl: snapshot.metadata.fullPath })
            .then(res => {
                console.log('Respuesta',res)
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