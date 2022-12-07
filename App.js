import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { LogBox, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import stylesGral from './app/utils/StyleSheetGeneral';
import { Icon, Image, LinearProgress, Text } from "react-native-elements"
import { AuthContext } from "./app/contexts/AuthContext"
import AsyncStorage from '@react-native-async-storage/async-storage'
import estilosVar from "./app/utils/estilos"
import Loading from "./app/componentes/Loading"
import HomeStack from "./app/navigations/HomeStack"
import MenuStack from "./app/navigations/MenuStack"
import axiosInstance from './app/utils/axiosInstance'
import constantes from "./app/utils/constantes"
import LoginStack from './app/navigations/LoginStack'
import PerfilStack from './app/navigations/PerfilStack';
import { navigationRef } from "./app/navigations/RootNavigation"
import { useUsrCiudadanoFirestore } from "./app/customhooks/useUsrCiudadanoFirestore"
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications'
import * as RootNavigation from "./app/navigations/RootNavigation"
import { formatearUrl } from "./app/utils/FormatearUrl"


/*Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})*/
// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('pre addNotificationResponseReceivedListener', response)
    AsyncStorage.setItem(constantes.rutaNotificacion, response.notification.request.content.data.url)
    /* console.log('app url', response.notification.request.content.data.url)
     if (
         response &&
         response.notification.request.content.data.url &&
         response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
     ) {
         //Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
 
         //RootNavigation.navigate('cambiarcelular')
     }*/

    //RootNavigation.navigate('turnosHome')
})

//const preLastNotificationResponse = Notifications.useLastNotificationResponse();
//console.log('otro pre lastNotificationResponse', preLastNotificationResponse.notification.request.content.data.url)
LogBox.ignoreAllLogs()

export default function App({ navigation }) {
    const RootStack = createNativeStackNavigator();
    const [iniciando, setIniciando] = useState(true)
    const { iniciarSesionEmailYPass, crearUsuarioEmailYPassConCiudadano, cerrarSesionAuth, recuperarDatosDeSesion, getReturnUsuario, returnGetDataDoc } = useUsrCiudadanoFirestore()


    const colUsuariosInfo = constantes.colecciones.usuariosInfo;

    const initialLoginState = {
        isLoading: false,
        loadingText: '',
        email: '',
        datoUsr: '',
        userToken: null,
        usuarioInfoFs: null,
        isError: false,
        errorText: '',
        typeLogin: null
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
                    typeLogin: action.typeLogin
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
            let usuarioInfo = null;
            let email = '';
            const datoUsr = credenciales.datoUsr;
            const password = credenciales.password;

            dispatch({ type: 'PETICION', loadingText: 'Iniciando Sesión...' });

            try {
                if (!isNaN(datoUsr)) {
                    const ciudadanoEmail = await axios.post(constantes.API + 'buscaEmailCiudadanoConDni', { dni: datoUsr });
                    console.log('ciudadanoEmail', ciudadanoEmail);
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
                    payload = await iniciarSesionEmailYPass(email, password)

                    console.log('payload.usuarioInfo.phone ', payload.usuarioInfo.phone)

                    if (payload.usuarioInfo.phone !== null) {
                        AsyncStorage.setItem('numeroCelular', payload.usuarioInfo.phone)
                    }



                    dispatch({ type: 'LOGIN', ...payload })
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
                        const temp = PimUsuario.nombres
                        delete PimUsuario.nombres
                        PimUsuario['nombres'] = temp.split(' ').slice(1).join(' ');
                        PimUsuario['apellido'] = temp.split(' ').slice(0, 1).join(' ');
                        await crearUsuarioEmailYPassConCiudadano(email, password, PimUsuario).then(() => {
                            authContext.signIn({ datoUsr, password });
                        }).catch((error) => {
                            console.log('desde APP.js error crearUsuarioEmailYPassConCiudadano ', error)
                            dispatch({ type: 'ERROR', errorText: 'Error en el servicio de autenticación' });
                        })

                    } else {
                        //Si no existe en pim, entonces es un usuario Firebase
                        errorMsj = 'Usuario o contraseña incorrectos';

                    }


                } else if (e.code === 'auth/invalid-email') {
                    errorMsj = 'Formato de email incorrecto';
                    // console.log(e);
                } else if (e.code === 'auth/wrong-password') {
                    errorMsj = 'Contraseña incorrecta';
                    //console.log(e);
                } else {
                    errorMsj = 'Ocurrió un error inesperado con el servicio de autenticación ' + e.code;
                    console.log('Ocurrió un error inesperado con el servicio de autenticación ', e);
                }

                if (errorMsj !== '') {
                    dispatch({ type: 'ERROR', errorText: errorMsj });
                }
            }
        },
        signOut: async () => {
            try {
                cerrarSesionAuth()
            } catch (e) {
                console.log(e);
            }

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
        },
        verAuth: async () => {
            /*  const auth = getAuth()
              console.log('verAuth', auth)
              let usuarioInfo = await returnGetDataDoc('usuariosInfo', auth.currentUser.uid)
              let ciudadanoInfo = await returnGetDataDoc('ciudadanos', usuarioInfo.id_ciudadano)
              console.log('USR', usuarioInfo, ciudadanoInfo)
              usuarioInfo = { ...usuarioInfo, ...ciudadanoInfo }
  
              let resultado = {
                  email: ciudadanoInfo.email,
                  token: auth.currentUser.stsTokenManager.accessToken,
                  usuarioInfo: usuarioInfo
              }
              authContext.dispatchManual('LOGIN', resultado)*/
            payloadLogin = await recuperarDatosDeSesion('App -> verAuth')
            console.log(payloadLogin);
        }
    }), []);

    useEffect(() => {
        setTimeout(async () => {
            let payloadLogin = false;

            try {
                payloadLogin = await recuperarDatosDeSesion('App -> useEffect timeout 1000')
                setIniciando(false)
                if (payloadLogin) {
                    authContext.dispatchManual('LOGIN', payloadLogin);
                }
                //userToken = await AsyncStorage.getItem('userToken ');
            } catch (e) {
                console.log(e);
            }
        }, 1000);
    }, []);


    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    })
    const notificationListener = useRef();
    const responseListener = useRef();

    /* useEffect(async () => {
 
 
         notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
             //console.log('app addNotificationReceivedListener', notification);
             //RootNavigation.navigate('cambiarcelular')
         });
 
         responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
             //console.log('app addNotificationResponseReceivedListener', response);
             RootNavigation.navigate('turnosHome')
         });
 
         return () => {
             Notifications.removeNotificationSubscription(notificationListener.current);
             Notifications.removeNotificationSubscription(responseListener.current);
         }
     }, [])*/

    const lastNotificationResponse = Notifications.useLastNotificationResponse();

    React.useEffect(() => {
        if (
            lastNotificationResponse &&
            lastNotificationResponse.notification.request.content.data.url &&
            lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
            //Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
            console.log('app lastNotificationResponse', lastNotificationResponse.notification.request.content.data.url)
            const urlNoti = lastNotificationResponse.notification.request.content.data.url
            const urlData = formatearUrl(urlNoti)
            console.log('urlData', urlData)
            RootNavigation.navigate(urlData.screen, urlData.params)
        }
    }, [lastNotificationResponse]);



    const Tab = createBottomTabNavigator()

    return (
        <AuthContext.Provider value={{ authContext: authContext, loginState: loginState }}>
            <NavigationContainer ref={navigationRef}>


                {iniciando ? (
                    <View style={stylesGral.vistaPreviaALogin}>
                        <View style={{ width: '100%' }}><Image style={{ width: '100%', height: 250, marginTop: 0 }} resizeMode="contain" source={require("./assets/logo-gualeactiva.png")} /></View>

                        <LinearProgress color="primary" style={{ width: "90%" }} />
                        <Text style={[stylesGral.textBoldBlanco, stylesGral.tituloH5, { paddingTop: 10 }]}>Iniciando...</Text>
                    </View>) :
                    loginState.userToken !== null ? (

                        // User is signed in
                        <Tab.Navigator

                            screenOptions={({ route }) => ({

                                tabBarInactiveTintColor: estilosVar.colorIconoInactivo,
                                tabBarActiveTintColor: 'black',//estilosVar.colorIconoActivo,
                                tabBarIcon: ({ color, focused }) => screenOption(route, color, focused),
                                tabBarStyle: { ...stylesGral.tabBarStyles },
                                tabBarLabelStyle: { fontSize: 16 },

                            })}
                        >

                            <Tab.Screen name="home-stack" component={HomeStack} options={{ title: "Inicio", headerShown: false, unmountOnBlur: true, }} />
                            <Tab.Screen name="perfil-stack" component={PerfilStack} options={{ title: "Mi perfil", headerShown: false, unmountOnBlur: true }} />
                            {/* <Tab.Screen name="menu-stack" component={MenuStack} options={{ title: "Menu", headerShown: false }} /> */}

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

function screenOption(route, color, focused) {
    let iconName;

    switch (route.name) {

        case "menu-stack":
            iconName = "compass";
            break;
        case "home-stack":
            iconName = (focused) ? "home" : "home-outline";
            break;
        case "login-stack":
            iconName = "home";
            break;
        case "perfil-stack":
            iconName = (focused) ? "account" : "account-outline";
            break;
        default:
            break;
    }

    return (
        <View>
            <Icon type="material-community" name={iconName} size={22} color={color} />
        </View>
    )
}