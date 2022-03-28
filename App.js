import React, { useEffect } from 'react';
import axios from 'axios';

import { Button, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { Icon } from "react-native-elements"
import { AuthContext } from "./app/contexts/AuthContext"
import AsyncStorage from '@react-native-async-storage/async-storage';
import estilosVar from "./app/utils/estilos"
import Loading from "./app/componentes/Loading"
import HomeStack from "./app/navigations/HomeStack"
import MenuStack from "./app/navigations/MenuStack"
import axiosInstance from './app/utils/axiosInstance';
import constantes from "./app/utils/constantes"
import LoginStack from './app/navigations/LoginStack';
import { navigationRef } from "./app/navigations/RootNavigation";
import Logout from './app/pantallas/cuenta/Logout';


export default function App({ navigation }) {
    const RootStack = createNativeStackNavigator();
    const initialLoginState = {
        isLoading: true,
        loadingText: '',
        dni: null,
        userToken: null,
        isError: false,
        errorText: '',
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'ERROR':
                return {
                    ...prevState,
                    dni: null,
                    userToken: null,
                    isLoading: false,
                    loadingText: '',
                    isError: true,
                    errorText: action.errorText,
                };
            case 'PETICION':
                return {
                    ...prevState,
                    isLoading: true,
                    loadingText: action.loadingText,
                    isError: false,
                    errorText: '',
                };
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                    loadingText: '',
                    isError: false,
                    errorText: '',
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    dni: action.id,
                    userToken: action.token,
                    isLoading: false,
                    loadingText: '',
                    isError: false,
                    errorText: '',
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    dni: null,
                    userToken: null,
                    isLoading: false,
                    loadingText: '',
                    isError: false,
                    errorText: '',
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    dni: action.dni,
                    userToken: action.token,
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
            let type = 'LOGIN';
            let payload = null;
            let userToken = null;
            const dni = credenciales.dni;
            const password = credenciales.password;
            try {
                const url = constantes.API + 'loginApi';

                dispatch({ type: 'PETICION', loadingText: 'Iniciando Sesión...' })
                const datos = { datousuario: dni, claveusuario: password };

                const response = await axios.post(url, datos);

                if (response.data.success) {
                    const usuario = response['data'];
                    //console.log(usuario);
                    userToken = usuario['data']['token'];
                    //await AsyncStorage.setItem('userToken', userToken);
                    payload = { dni: dni, token: userToken };
                } else {
                    type = 'ERROR';
                    payload = { errorText: response.data.error };
                    // dispatch({ type: 'ERROR', errorText: response.data.error });
                }
            } catch (e) {
                console.log(e);
            }

            dispatch({ type: type, ...payload });

        },
        signOut: async () => {
            try {
                const url = constantes.API + 'cerrarSesionApi';
                // userToken = await AsyncStorage.getItem('userToken');
                const response = await axios.post(url, { jwt: userToken });
                //await AsyncStorage.removeItem('userToken');
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
        }
    }), []);

    useEffect(() => {
        setTimeout(async () => {
            console.log();
            let userToken;
            userToken = null;
            try {
                //userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                console.log(e);
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


}
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