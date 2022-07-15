import { useEffect, useState, useRef, useContext } from "react";
import { StyleSheet, Text, ScrollView, View, Modal } from "react-native";

import { Input, Icon, Button, Card, SocialIcon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { getAuth, GoogleAuthProvider, signInWithCredential, PhoneAuthProvider, deleteUser, fetchSignInMethodsForEmail } from "firebase/auth";
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

import { AuthContext } from "../../contexts/AuthContext";
import { getApp } from "../../utils/firebase-config"
import estilosVar from "../../utils/estilos";
import stylesGral from "../../utils/StyleSheetGeneral";
import constantes from "../../utils/constantes";
import { expRegulares } from "../../utils/validaciones";
import Loading from "../../componentes/Loading";
import ModalComp from "../../componentes/ModalComp";
import { useTraducirFirebaseError } from "../../customhooks/useTraducirFirebaseError";
import WebViewAfip from "./WebViewAfip";
import WebViewAnses from "./WebViewAnses";
import AsyncStorage from '@react-native-async-storage/async-storage'

WebBrowser.maybeCompleteAuthSession();

export default function Login() {

    const [loading, setLoading] = useState(false);
    const [stateModalCelular, setStateModalCelular] = useState(false);
    const [stateModalAfip, setStateModalAfip] = useState(false);
    const [stateModalAnses, setStateModalAnses] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigation = useNavigation();

    const [datoUsr, setDatoUsr] = useState("");
    const [password, setPassword] = useState("");
    const { authContext, loginState } = useContext(AuthContext);
    const auth = getAuth();
    const app = getApp()
    const recaptchaVerifier = useRef(null);
    const initialCodeSend = { viewCodeInput: false, code: "" }

    const [numero, setNumero] = useState(null);
    const [codeSend, setCodeSend] = useState(initialCodeSend);
    const [verificationId, setVerificationId] = useState(null)
    const { recuperarDatosDeSesion } = useUsrCiudadanoFirestore()
    const { state: verifCelularError, dispatch: dispatchCelularError } = useTraducirFirebaseError()
    const [errorNumCelular, setErrorNumCelular] = useState(null)

    useEffect(async () => {
        let numeroCelular = await AsyncStorage.getItem('numeroCelular');
        //console.log('numeroCelular', numeroCelular)
        setNumero(numeroCelular)
    }, [])

    const blanquearCodeSend = () => {
        //console.log('blanquearCodeSend')
        setCodeSend(initialCodeSend)
        setNumero(null)
        AsyncStorage.setItem('numeroCelular', null)
    }

    const sendMessage = async () => {
        console.log('numero 2', numero)
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
    };

    const signInWithPhone = async () => {
        const credential = PhoneAuthProvider.credential(verificationId, codeSend.code);

        await signInWithCredential(auth, credential).then(async (res) => {
            let payloadLogin = null;
            console.log("Nuevo usuario:", res._tokenResponse.isNewUser);
            if (!res._tokenResponse.isNewUser) {
                payloadLogin = await recuperarDatosDeSesion()
                if (payloadLogin) {
                    authContext.dispatchManual('LOGIN', payloadLogin);
                } else {
                    console.log('Sin tados para recuperarDatosDeSesion login celular')
                }
            } else {
                deleteUser(getAuth().currentUser).then((res) => {
                    navigation.navigate("registro")
                })
            }
        }).catch((error) => {
            dispatchCelularError({ type: error.code })
        })
    }

    // promptAsync -> al invocarse, se abre un navegador web y se le solicita al usuario que se autentique.
    const [request, response, promptAsync] = Google.useAuthRequest({ expoClientId: constantes.expoClientIdGoogle });
    const popupGoogle = () => { promptAsync({ useProxy: true, showInRecents: true }); };

    useEffect(() => {
        if (response?.type === "success") {
            setLoading(true)
            const credential = GoogleAuthProvider.credential(null, response.authentication.accessToken);

            signInWithCredential(auth, credential).then((res) => {
                res.user && setLoading(false);
                fetchSignInMethodsForEmail(auth, res.user.email).then(providers => {
                    /*if(res.user.emailVerified && providers.find(p => p === "password") === "password"){
                        // Tiene mail verificado y se registró antes
                        authContext.dispatchManual('LOGIN', { token: auth.currentUser.accessToken })
                    }*/
                    if (res._tokenResponse.isNewUser) {
                        // Es nuevo usuario de google
                        navigation.navigate("registro", { user_data: res.user })
                    } else {
                        authContext.dispatchManual('LOGIN', { token: auth.currentUser.accessToken })
                    }
                })
            })
        }
    }, [response]);

    const handleDatoUsr = (e) => {
        setDatoUsr(e.nativeEvent.text);
    };

    const handlePass = (e) => {
        setPassword(e.nativeEvent.text);
    };

    const abrirModalCelular = async () => {
        dispatchCelularError({ type: null })

        setErrorNumCelular(null)


        if (numero) {
            setStateModalCelular(true)
            setTimeout(() => {
                sendMessage()
            }, 10)
        } else {
            setNumero(null, setStateModalCelular(true))
        }
        //setStateModalCelular(true)
    }

    const abrirModalAFIP = () => {
        setStateModalAfip(true)
    }

    const abrirModalANSES = () => {
        setStateModalAnses(true)
    }



    return (
        <ScrollView>
            <Card>
                <Card.Title>
                    <Text style={styles.tituloCard}>
                        Indique Email o DNI y Contraseña x
                    </Text>
                </Card.Title>
                <Card.Image style={styles.logo} source={require("../../../assets/logo-color.png")} />
                <Card.Divider />
                <Input
                    placeholder="Email o DNI"
                    containerStyle={styles.inputForm}
                    rightIcon={
                        <Icon
                            type="material"
                            name="account-circle"
                            iconStyle={styles.iconRight}
                        />
                    }
                    onChange={(e) => handleDatoUsr(e)}
                />
                <Input
                    placeholder="Contraseña"
                    containerStyle={styles.inputForm}
                    password={true}
                    secureTextEntry={showPass ? false : true}
                    rightIcon={
                        <Icon
                            type="material"
                            name={showPass ? "visibility-off" : "visibility"}
                            iconStyle={styles.iconRight}
                            onPress={() => setShowPass(!showPass)}
                        />
                    }
                    onChange={(e) => handlePass(e)}
                />
                {loginState.isError ? (
                    <Text style={stylesGral.errorText}>{loginState.errorText}</Text>
                ) : null}
                <Button title="Iniciar Sesión" onPress={() => authContext.signIn({ datoUsr, password })} />

                <Card.Divider />
                <Text style={styles.textRegister}> ¿Aún no tienes una cuenta?&nbsp;&nbsp; <Text style={styles.btnRegister} onPress={() => navigation.navigate("registro")} > Registrate </Text> </Text>

                <View style={styles.boxSocial}>
                    <Button buttonStyle={styles.btnLoginPhone} title="Iniciar con teléfono" onPress={abrirModalCelular} />

                    <Button buttonStyle={styles.btnLoginAFIP} title="Iniciar con AFIP" onPress={abrirModalAFIP} />
                    <Button buttonStyle={styles.btnLoginANSES} title="Iniciar con ANSES" onPress={abrirModalANSES} />
                </View>
            </Card>

            {stateModalCelular &&
                <ModalComp stateModal={stateModalCelular} setModalState={setStateModalCelular} titulo="Iniciar sesión con teléfono">
                    <View style={styles.modal}>
                        {!codeSend.viewCodeInput ?
                            <View>
                                <Text style={{ fontWeight: '700' }}>Celular</Text>
                                <Input style={styles.inputFormModal} placeholder="Celular" value={numero} onChange={(e) => { setNumero(e.nativeEvent.text) }} />
                                <View style={styles.iconRow}>
                                    <Icon style={styles.styleIcon} name="information" type="material-community" color={estilosVar.naranjaBitter} />
                                    <Text style={styles.textInfo}>Código de área sin "0" + Teléfono sin "15"</Text>
                                </View>
                                <Button title="Iniciar sesion" onPress={sendMessage} style={styles.btnRegister} />
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
                                <Text style={{ fontWeight: '700' }}>Ingrese el codigo enviado a su celular {numero} </Text>


                                <Input style={styles.inputFormModal} placeholder="Codigo" onChange={(e) => { setCodeSend({ viewCodeInput: true, code: e.nativeEvent.text }) }} rightIcon={
                                    <Icon name='cellphone-message' type='material-community' size={24} color='gray' />
                                } />
                                <Button title="Verificar codigo" onPress={signInWithPhone} style={styles.btnCode} />
                                <Text>{"\n"}</Text>
                                <Button title=" Cambiar Nº teléfono" onPress={blanquearCodeSend} style={styles.btnCode} />

                                {(verifCelularError) ?
                                    <>
                                        <Text style={stylesGral.errorText}>{verifCelularError}</Text>
                                    </>
                                    : null
                                }
                            </View>
                        }
                    </View>
                </ModalComp>
            }


            <Modal visible={stateModalAfip} animationType="slide" visible={stateModalAfip} titulo="Iniciar sesión con AFIP">
                <Icon type="material-community" name="close" color="#000" onPress={() => { setStateModalAfip(false) }} />
                <WebViewAfip></WebViewAfip>
            </Modal>

            <Modal visible={stateModalAnses} animationType="slide" visible={stateModalAnses} titulo="Iniciar sesión con Anses">
                <Icon type="material-community" name="close" color="#000" onPress={() => { setStateModalAnses(false) }} />
                <WebViewAnses></WebViewAnses>
            </Modal>

            {loading && <Loading isLoading={loading} text={"Espere un momento..."} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    iconRight: {
        color: estilosVar.colorIconoInactivo,
    },
    tituloCard: {
        fontSize: 25,
    },
    textRegister: {
        textAlign: "center",
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10,
    },
    btnRegister: {
        color: estilosVar.azulSuave,
        fontWeight: "bold",
    },
    logo: {
        //width: 200,
    },
    boxSocial: {
        marginTop: 40,
        marginBottom: 10,
    },
    btnLoginPhone: {
        backgroundColor: "#29117d",
        borderRadius: 25,
        height: 52,
        marginRight: 5,
        marginLeft: 5,
    },
    btnLoginAFIP: {
        backgroundColor: "#1ed760",
        borderRadius: 25,
        height: 52,
        marginRight: 5,
        marginLeft: 5,
    },
    btnLoginANSES: {
        backgroundColor: "#38a9ff",
        borderRadius: 25,
        height: 52,
        marginRight: 5,
        marginLeft: 5,
    },
    // Modal
    modal: {
        margin: 20
    },
    btnRegister: {
        color: estilosVar.azulSuave,
        fontWeight: "bold",
    },
    iconRow: {
        flexDirection: "row",
        alignContent: "center"
    },
    styleIcon: {
        fontSize: 30,
        width: 40,
        height: 41
    },
    textInfo: {
        height: 29,
        width: 265,
    },
    inputFormModal: {
        width: "100%",
    }
});