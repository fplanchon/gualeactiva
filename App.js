import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { Icon } from "react-native-elements"
import { AuthContext } from "./app/contexts/AuthContext"
import AsyncStorage from '@react-native-async-storage/async-storage'

import { initFirebase } from "./app/utils"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import estilosVar from "./app/utils/estilos"
import Loading from "./app/componentes/Loading"
import HomeStack from "./app/navigations/HomeStack"
import MenuStack from "./app/navigations/MenuStack"
import axiosInstance from './app/utils/axiosInstance'
import constantes from "./app/utils/constantes"
import LoginStack from './app/navigations/LoginStack'
import { navigationRef } from "./app/navigations/RootNavigation"
import { useFirestore } from './app/customhooks/useFirestore';

LogBox.ignoreAllLogs();

export default function App({ navigation }) {
    const RootStack = createNativeStackNavigator();

    const { setDocument } = useFirestore()
    const { data: dataUsrFs, error: errorUsrFs, loading: loadingUsrFs, getDataDoc: getDataDocUsrFs } = useFirestore()
    const colUsuariosInfo = constantes.colecciones.usuariosInfo;

    const initialLoginState = {
        isLoading: true,
        loadingText: '',
        email: '',
        datoUsr: '',
        userToken: null,
        usuarioInfoFs: null,
        isError: false,
        errorText: '',
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'ERROR':
                return {
                    ...prevState,
                    datoUsr: null,
                    email: null,
                    userToken: null,
                    usuarioInfoFs: null,
                    isLoading: false,
                    loadingText: '',
                    isError: true,
                    errorText: action.errorText,
                };
            case 'PETICION':
                return {
                    ...prevState,
                    datoUsr: null,
                    isLoading: true,
                    loadingText: action.loadingText,
                    isError: false,
                    errorText: '',
                };
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    datoUsr: null,
                    userToken: action.token,
                    isLoading: false,
                    loadingText: '',
                    isError: false,
                    errorText: '',
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    datoUsr: null,
                    email: action.email,
                    userToken: action.token,
                    isLoading: false,
                    usuarioInfoFs: action.usuarioInfo,
                    loadingText: '',
                    isError: false,
                    errorText: '',
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    datoUsr: null,
                    email: null,
                    userToken: null,
                    isLoading: false,
                    usuarioInfoFs: null,
                    loadingText: '',
                    isError: false,
                    errorText: '',
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    datoUsr: null,
                    email: action.email,
                    userToken: action.token,
                    usuarioInfoFs: null,
                    isLoading: false,
                    loadingText: '',
                    isError: false,
                    errorText: '',
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);


    const authContext = React.useMemo(() => ({
        signIn: async (credenciales) => {
            let payload = null;
            let userToken = null;
            let email = '';
            let usuarioInfoFs = null;
            const datoUsr = credenciales.datoUsr;
            const password = credenciales.password;

            dispatch({ type: 'PETICION', loadingText: 'Iniciando Sesión...' });

            try {
                if (!isNaN(datoUsr)) {
                    const ciudadanoEmail = await axios.post(constantes.API + 'buscaEmailCiudadanoConDni', { dni: datoUsr });
                    //console.log('ciudadanoEmail', ciudadanoEmail);
                    if (ciudadanoEmail.data.success) {
                        email = ciudadanoEmail.data.data.email_activa;
                    } else {
                        //email = 'email@email.com';
                        dispatch({ type: 'ERROR', errorText: ciudadanoEmail.data.error });
                    }

                } else {
                    email = datoUsr;
                }

                //1 - Si existe en firebase, logg ok 
                if (email !== '') {
                    const auth = getAuth();
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password,
                    );
                    console.log('AUTHfirebase', auth.currentUser);


                    userToken = auth.currentUser.stsTokenManager.accessToken;

                    getDataDocUsrFs(colUsuariosInfo, auth.currentUser.uid)


                    payload = { email: email, token: userToken, usuarioInfo: dataUsrFs };


                    dispatch({ type: 'LOGIN', ...payload });
                }
            } catch (e) {
                let errorMsj = '';
                //2 - Si no existe en firebase, verifico en pim
                if (e.code === 'auth/user-not-found') {
                    const url = constantes.API + 'obtenerUsuarioLegacy';
                    const datos = { datousuario: email, claveusuario: password };
                    const response = await axios.post(url, datos);

                    if (response.data.success) {
                        const PimUsuario = response.data.data;
                        //console.log('PimUsuario', PimUsuario);
                        const auth = getAuth();

                        await createUserWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                // Signed in
                            })
                            .catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                console.log('createUserWithEmailAndPassword', errorCode);

                                // ..
                            });


                        await updateProfile(getAuth().currentUser, { displayName: PimUsuario.nombres }).then(() => {
                            // Profile updated!
                            authContext.signIn({ datoUsr, password });
                            // ...
                        }).catch((error) => {
                            console.log('error updateProfile', error);
                        });

                        await setDocument(colUsuariosInfo, getAuth().currentUser.uid, {
                            'id_ciudadano': PimUsuario.id_ciudadano,
                            'nombres': PimUsuario.nombres,
                            'cuitcuil': PimUsuario.cuitcuil
                        }).then(() => {

                        }).catch((error) => {
                            console.log('setDocument ln196: ', error);
                        });

                    } else {
                        //Si no existe en pim, entonces es un usuario
                        errorMsj = 'Usuario o contraseña incorrectos';

                    }


                } else if (e.code === 'auth/invalid-email') {
                    errorMsj = 'Formato de email incorrecto';
                    console.log(e);
                } else if (e.code === 'auth/wrong-password') {
                    errorMsj = 'Contraseña incorrecta';
                    console.log(e);
                } else {
                    errorMsj = 'Ocurrió un error inesperado con el servicio de autenticación ' + e.code;
                    console.log(e);
                }

                if (errorMsj !== '') {
                    dispatch({ type: 'ERROR', errorText: errorMsj });
                }
            }
        },
        signOut: async () => {
            /*try {
                const url = constantes.API + 'cerrarSesionApi';
                // userToken = await AsyncStorage.getItem('userToken');
                const response = await axios.post(url, { jwt: userToken });
                //await AsyncStorage.removeItem('userToken');
            } catch (e) {
                console.log(e);
            }*/
            const auth = getAuth()
            signOut(auth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                // An error happened.
            });
            dispatch({ type: 'LOGOUT' });
        },
        signUp: () => {

        },
        getContexto: () => {
            return loginState;
        },
        postAxios: async (url, data) => {
            const result = await axiosInstance.post(url, data).catch((err) => {
                if (err.status == 401) {
                    alert(err.data.error);
                    dispatch({ type: 'LOGOUT' });
                }
            });

            if (result) {
                return result.data;
            }
        },
        dispatchManual: (tipo, payload) => {
            dispatch({ type: tipo, ...payload });
        }
    }), []);

    useEffect(() => {
        setTimeout(async () => {
            let userToken;
            userToken = null;
            try {
                const auth = getAuth()
                userToken = auth.currentUser.accessToken
                //userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                //console.log(e);
            }

            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
        }, 1000);
    }, []);

    const Tab = createBottomTabNavigator()

    return (
        <AuthContext.Provider value={{ authContext: authContext, loginState: loginState }}>
            <NavigationContainer ref={navigationRef}>
                {loginState.userToken !== null ? (

                    // User is signed in
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarInactiveTintColor: estilosVar.colorIconoInactivo,
                            tabBarActiveTintColor: estilosVar.colorIconoActivo,
                            tabBarIcon: ({ color }) => screenOption(route, color)
                        })}
                    >

                        <Tab.Screen name="home-stack" component={HomeStack} options={{ title: "Home", headerShown: false }} />
                        <Tab.Screen name="menu-stack" component={MenuStack} options={{ title: "Menu", headerShown: false }} />

                    </Tab.Navigator>
                ) :
                    <LoginStack />
                }

            </NavigationContainer>
            {loginState.isLoading == true ? (
                <Loading isLoading={true} text={(loginState.loadingText == "") ? "Aguarde..." : loginState.loadingText} />
            ) : null}
        </AuthContext.Provider>
    );


}//APP

function screenOption(route, color) {
    let iconName;

    switch (route.name) {

        case "menu-stack":
            iconName = "compass";
            break;
        case "home-stack":
            iconName = "star-outline";
            break;
        case "login-stack":
            iconName = "home";
            break;
        default:
            break;
    }

    return <Icon type="material-community" name={iconName} size={22} color={color} />
}