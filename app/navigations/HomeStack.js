import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Icon, Text, View, Image } from 'react-native-elements';
import Home from '../pantallas/home/Home';
import Logout from '../pantallas/cuenta/Logout';
import Sandbox from '../pantallas/home/Sandbox'
import estilosVar from '../utils/estilos';
import TasasHome from '../pantallas/modules/tasas/TasasHome';
import TurnosHome from '../pantallas/modules/turnos/TurnosHome';
import SolicitudesHome from '../pantallas/modules/solicitudes/SolicitudesHome';
import Notificaciones from '../componentes/home/Notificaciones';
import SolicitarTurno from '../pantallas/modules/turnos/SolicitarTurno';
import Perfil from "../pantallas/cuenta/Perfil"
import AjustesNotificaciones from '../pantallas/cuenta/perfil/AjustesNotificaciones';
import CambiarCelular from '../componentes/perfil/CambiarCelular';
import { useNavigation } from '@react-navigation/native';
import { useUsrCiudadanoFirestore } from '../customhooks/useUsrCiudadanoFirestore';
import stylesGral from '../utils/StyleSheetGeneral';
import Solicitud from '../pantallas/modules/solicitudes/Solicitud';
import NuevaSolicitud from '../pantallas/modules/solicitudes/NuevaSolicitud';
import SelectorTramite from '../pantallas/modules/solicitudes/SelectorTramite';

const Stack = createNativeStackNavigator()

export default function HomeStack() {
    const navigation = useNavigation();
    const [id_ciudadano, setIDCiudadano] = useState(null);
    const { recuperarDatosDeSesion } = useUsrCiudadanoFirestore();

    useEffect(async () => {
        const { usuarioInfo } = await recuperarDatosDeSesion('HomeStack useEffect');
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
            <Stack.Screen
                name="solicitudesHome"
                component={SolicitudesHome}
                options={{ title: "Solicitudes", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen }} />
            <Stack.Screen
                name="miperfil"
                component={Perfil}
                options={{ title: "Mi perfil e", ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="ajustesnotificaciones"
                component={AjustesNotificaciones}
                options={{ title: "Ajustes Notificaciones", ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="cambiarcelular"
                component={CambiarCelular}
                options={{ title: "Cambiar Celular", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="solicitud"
                component={Solicitud}
                options={{ title: "Solicitud", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="nuevasolicitud"
                component={NuevaSolicitud}
                options={{ title: "Nueva Solicitud", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="selectortramite"
                component={SelectorTramite}
                options={{ title: "Seleccionar Trámite", headerRight: iconoNotificaciones, ...opcionesComunesStackScreen }}
            />
        </Stack.Navigator >
    )
}