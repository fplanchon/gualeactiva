import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Icon, Text, View, Image } from 'react-native-elements';
import Home from '../pantallas/home/Home';
import Logout from '../pantallas/cuenta/Logout';
import Sandbox from '../pantallas/home/Sandbox'
import estilosVar from '../utils/estilos';
import TasasHome from '../pantallas/modules/tasas/TasasHome';
import TurnosHome from '../pantallas/modules/turnos/TurnosHome';
import Notificaciones from '../componentes/home/Notificaciones';
import SolicitarTurno from '../pantallas/modules/turnos/SolicitarTurno';
import { useNavigation } from '@react-navigation/native';
import { useUsrCiudadanoFirestore } from '../customhooks/useUsrCiudadanoFirestore';
import stylesGral from '../utils/StyleSheetGeneral';

const Stack = createNativeStackNavigator()

export default function HomeStack() {
    const navigation = useNavigation();
    const [id_ciudadano, setIDCiudadano] = useState(null);
    const { recuperarDatosDeSesion } = useUsrCiudadanoFirestore();

    useEffect(async () => {
        const { usuarioInfo } = await recuperarDatosDeSesion();
        if (usuarioInfo) {
            setIDCiudadano(usuarioInfo.id_ciudadano)
        }
    }, [])

    const iconoNotificaciones = () => (
        <Icon type="material-community" color={'white'} name="bell-outline" onPress={() => navigation.navigate("notifications", { id_ciudadano: id_ciudadano })} />
    )

    const opcionesComunesStackScreen = {

        headerStyle: stylesGral.headerStyle, headerTintColor: 'white', headerTitleStyle: stylesGral.headerTitleStyle
    }

    const imagenHeader = () =>
    (

        <Image style={{ width: "100%", height: 75, marginTop: 0 }} resizeMode="contain" source={require("../../assets/logo-gualeactiva.png")} />

    )


    return (
        <Stack.Navigator >
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: "Inicio", headerRight: iconoNotificaciones, headerBackground: imagenHeader,
                    ...opcionesComunesStackScreen
                }}
            />
            <Stack.Screen
                name="Sandbox"
                component={Sandbox}
                options={{ title: "Sandbox", ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="Logout"
                component={Logout}
                options={{ title: "Logout" }}
            />
            <Stack.Screen
                name='notifications'
                component={Notificaciones}
                options={{ title: "Notificaciones", ...opcionesComunesStackScreen }} />

            <Stack.Screen
                name="tasasHome"
                component={TasasHome}
                options={{
                    title: "Tasas (Boletas)", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen
                }} />
            <Stack.Screen
                name="turnosHome"
                component={TurnosHome}
                options={{ title: "Turnos", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen }} />
            <Stack.Screen
                name="SolicitarTurno"
                component={SolicitarTurno}
                options={{ title: "Solicitar Turno", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen }} />
        </Stack.Navigator >
    )
}