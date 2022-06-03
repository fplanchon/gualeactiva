import { useEffect, useState, useRef, useContext } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";

import { Input, Icon, Button, Card, SocialIcon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { getAuth, GoogleAuthProvider, signInWithCredential, PhoneAuthProvider, deleteUser } from "firebase/auth";
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

WebBrowser.maybeCompleteAuthSession();





export default function Login() {
    const [loading, setLoading] = useState(false);
    const [stateModal, setStateModal] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigation = useNavigation();

    const [datoUsr, setDatoUsr] = useState("");
    const [password, setPassword] = useState("");
    const { authContext, loginState } = useContext(AuthContext);
    const auth = getAuth();
    const app = getApp()
    const recaptchaVerifier = useRef(null);

    const [numero, setNumero] = useState(null);
    const [codeSend, setCodeSend] = useState({ viewCodeInput: false, code: "" });
    const [verificationId, setVerificationId] = useState(null)

    const sendMessage = async () => {
        if (expRegulares.cel2.test(numero)) {
            const phoneProvider = new PhoneAuthProvider(auth);
            const verID = await phoneProvider.verifyPhoneNumber(
                "+54" + numero,
                recaptchaVerifier.current
            );
            setVerificationId(verID)
            setCodeSend({ viewCodeInput: true, code: "" });
        }
    };

    const signInWithPhone = async () => {
        const credential = PhoneAuthProvider.credential(verificationId, codeSend.code);
        await signInWithCredential(auth, credential).then((res) => {
            console.log("Nuevo usuario:", res._tokenResponse.isNewUser);
            if (!res._tokenResponse.isNewUser) {
                authContext.dispatchManual('LOGIN', { token: auth.currentUser.accessToken })
            } else {
                deleteUser(getAuth().currentUser).then((res) => {
                    navigation.navigate("registro")
                })
            }
        })
    }

    // promptAsync -> al invocarse, se abre un navegador web y se le solicita al usuario que se autentique.
    const [request, response, promptAsync] = Google.useAuthRequest({ expoClientId: constantes.expoClientIdGoogle });
    const popupGoogle = () => { promptAsync({ useProxy: true, showInRecents: true }); };

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                //navigation.navigate('Home');
                /* console.log("Usuario ya inicio sesion",user);*/
            } else {
                if (response?.type === "success") {
                    setLoading(true)
                    /* console.log("res",response); */
                    const token = response.authentication.accessToken;
                    const credential = GoogleAuthProvider.credential(null, token);
                    /* console.log("credential",credential); */
                    if (credential) {
                        signInWithCredential(auth, credential).then((res) => {
                            //const user = res.user;
                            res.user && setLoading(false);
                            navigation.navigate("registro", {
                                user_data: res.user
                            })
                        }).catch((error) => {
                            // Handle Errors here.
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            // The email of the user's account used.
                            const email = error.email;
                            // The credential that was used.
                            const credential = GoogleAuthProvider.credentialFromError(error);
                            // ...
                        });
                    }
                }
            }
        });
    }, [response]);

    const handleDatoUsr = (e) => {
        setDatoUsr(e.nativeEvent.text);
    };

    const handlePass = (e) => {
        setPassword(e.nativeEvent.text);
    };



    return (
        <ScrollView>
            <Card>
                <Card.Title>
                    <Text style={styles.tituloCard}>
                        Indique Email o DNI y Contraseña
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
                    <Button buttonStyle={styles.btnLoginPhone} title="Iniciar con teléfono" onPress={() => stateModal ? setStateModal(false) :
                        setStateModal(true)} />
                    <SocialIcon onPress={popupGoogle} title={"Iniciar sesión con Google"} button={true} type={"google"} />
                </View>
            </Card>

            {stateModal &&
                <ModalComp stateModal={stateModal} titulo="Iniciar sesión con teléfono">
                    <View style={styles.modal}>
                        {!codeSend.viewCodeInput ?
                            <View>
                                <Text style={{ fontWeight: '700' }}>Celular</Text>
                                <Input style={styles.inputFormModal} placeholder="Celular" onChange={(e) => { setNumero(e.nativeEvent.text) }} />
                                <View style={styles.iconRow}>
                                    <Icon style={styles.styleIcon} name="information" type="material-community" color={estilosVar.naranjaBitter} />
                                    <Text style={styles.textInfo}>Código de área sin "0" + Teléfono sin "15"</Text>
                                </View>
                                <Button title="Iniciar sesion" onPress={sendMessage} style={styles.btnRegister} />

                                <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={app.options} />
                            </View>
                            :
                            <View>
                                <Text style={{ fontWeight: '700' }}>Ingrese el codigo enviado a su celular</Text>
                                <Input style={styles.inputFormModal} placeholder="Codigo" onChange={(e) => { setCodeSend({ viewCodeInput: true, code: e.nativeEvent.text }) }} rightIcon={
                                    <Icon name='cellphone-message' type='material-community' size={24} color='gray' />
                                } />
                                <Button title="Verificar codigo" onPress={signInWithPhone} style={styles.btnCode} />
                            </View>
                        }
                    </View>
                </ModalComp>
            }

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
