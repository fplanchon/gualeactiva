import React, { useEffect, useRef, useState, useContext } from "react"
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from "react-native"
import { Icon, Input } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"

import estilosVar from "../../utils/estilos"
import axios from 'axios'

import { getAuth, PhoneAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth"
import { cuilValidator, dateValidator, expRegulares } from "../../utils/validaciones"
import stylesGral from "../../utils/StyleSheetGeneral"

import Loading from "../../componentes/Loading"
import { AuthContext } from "../../contexts/AuthContext"
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore"
import { useTraducirFirebaseError } from "../../customhooks/useTraducirFirebaseError"
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { getApp } from "../../utils/firebase-config"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { convertCompilerOptionsFromJson } from "typescript"

export default function CambiarCelular() {
    const { authContext, loginState } = useContext(AuthContext);
    const auth = getAuth();
    const navigation = useNavigation();
    const { setUsuarioFirestore, updateProfileFirestore, recuperarDatosDeSesion } = useUsrCiudadanoFirestore()

    const { state: verifCelularError, dispatch: dispatchCelularError } = useTraducirFirebaseError()
    const [userPhone, setUserPhone] = useState({ idUser: null, user: null })
    const [stateModalCelular, setStateModalCelular] = useState(false)
    const [loading, setLoading] = useState(false);
    const [verification, setVerification] = useState(null);

    const app = getApp()
    const [errorNumCelular, setErrorNumCelular] = useState(null)
    const [verificationId, setVerificationId] = useState(null)
    const [numero, setNumero] = useState(null);
    const recaptchaVerifier = useRef(null);
    const initialCodeSend = { viewCodeInput: false, code: "" }
    const [codeSend, setCodeSend] = useState(initialCodeSend);

    const irAMiPerfil = () => {
        navigation.navigate("miperfil")
    }

    const sendMessage = async () => {
        console.log('sendMessage: ', numero)
        if (numero !== '' && expRegulares.cel2.test(numero)) {
            const phoneProvider = new PhoneAuthProvider(auth);
            const verID = await phoneProvider.verifyPhoneNumber(
                "+54" + numero,
                recaptchaVerifier.current
            );
            AsyncStorage.setItem('numeroCelular', numero)
            setVerificationId(verID)
            setCodeSend({ viewCodeInput: true, code: "" })
            setErrorNumCelular(null)
        } else {
            setErrorNumCelular('Indique un numero válido')
        }
    }

    const cambiarNumeroCelular = async () => {
        const credential = PhoneAuthProvider.credential(verificationId, codeSend.code);
        await signInWithCredential(auth, credential).then(async (res) => {

            if (!res._tokenResponse.isNewUser) {
                dispatchCelularError({ type: 'Celular utilizado por otra cuenta' })
            } else {
                dispatchCelularError({ type: null })
                setUserPhone({ idUser: res.user.uid, user: res.user })
                const UsuarioInfo = loginState.usuarioInfoFs

                await setUsuarioFirestore(UsuarioInfo.id_ciudadano)

                await updateProfileFirestore({ phone: numero }, UsuarioInfo.id_ciudadano)

                const payloadLogin = await recuperarDatosDeSesion('CambiarCelular cambiarNumeroCelular')



                if (payloadLogin) {

                    authContext.dispatchManual('LOGIN', payloadLogin);
                }
                irAMiPerfil()

                //vuelvo a ejecutar el registro pero esta vez pasa a registrar usuario en firebase
            }
        }).catch((error) => {
            dispatchCelularError({ type: error.code })
        });
    }

    useEffect(() => {
        console.log('useEffect userPhone', userPhone)

    }, [userPhone])

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("useEffect CambiarCelular onAuthStateChanged", user)

            }
        });
    }, [])



    return (
        <View style={styles.modal}>
            {!codeSend.viewCodeInput ?
                <View>
                    <Input style={styles.inputFormModal} placeholder="3446...." value={numero} onChange={(e) => { setNumero(e.nativeEvent.text) }} />
                    <View style={styles.iconRow}>
                        <Icon style={styles.styleIcon} name="information" type="material-community" color={estilosVar.naranjaBitter} />
                        <Text style={styles.textInfo}>Código de área sin "0" + Teléfono sin "15"</Text>
                    </View>
                    <Button title="Cambiar" onPress={sendMessage} style={styles.btnRegister} />
                    {(errorNumCelular) ?
                        <>
                            <Text style={stylesGral.errorText}>{errorNumCelular}</Text>
                        </>
                        : null
                    }
                    <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={app.options} />
                </View>
                :
                <View>
                    <Text>{"\n"}</Text>
                    <Text>{"\n"}</Text>
                    <Text style={{ fontWeight: '700' }}>Ingrese el codigo enviado a su celular {numero} </Text>


                    <Input style={styles.inputFormModal} placeholder="Codigo" onChange={(e) => { setCodeSend({ viewCodeInput: true, code: e.nativeEvent.text }) }} rightIcon={
                        <Icon name='cellphone-message' type='material-community' size={24} color='gray' />
                    } />
                    <Button title="Verificar codigo" onPress={() => { cambiarNumeroCelular() }} style={styles.btnCode} />
                    <Text>{"\n"}</Text>


                    {(verifCelularError) ?
                        <>
                            <Text style={stylesGral.errorText}>{verifCelularError}</Text>
                        </>
                        : null
                    }
                </View>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    iconRow: {
        flexDirection: "row",
        alignContent: "center"
    },
    inputFormModal: {
        width: "100%",
    },
    styleIcon: {
        fontSize: 30,
        width: 40,
        height: 41
    },
    btnRegister: {
        color: estilosVar.azulSuave,
        fontWeight: "bold",
    },
})