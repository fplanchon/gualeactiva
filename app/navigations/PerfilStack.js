import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Perfil from "../pantallas/cuenta/Perfil"
import AjustesNotificaciones from '../pantallas/cuenta/perfil/AjustesNotificaciones';
import CambiarCelular from '../componentes/perfil/CambiarCelular';
import stylesGral from '../utils/StyleSheetGeneral';

const Stack = createNativeStackNavigator()
const iconoNotificaciones = () => (
    <Icon type="material-community" color={'white'} name="bell-outline" onPress={() => navigation.navigate("notifications", { id_ciudadano: id_ciudadano })} />
)

const opcionesComunesStackScreen = {
    headerStyle: stylesGral.headerStyle, headerTintColor: 'white', headerTitleStyle: stylesGral.headerTitleStyle
}

export default function PerfilStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="miperfil"
                component={Perfil}
                options={{ title: "Mi perfil", ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="ajustesnotificaciones"
                component={AjustesNotificaciones}
                options={{ title: "Ajustes Notificaciones", ...opcionesComunesStackScreen }}
            />
            <Stack.Screen
                name="cambiarcelular"
                component={CambiarCelular}
                options={{ title: "Cambiar Celular", ...opcionesComunesStackScreen }}
            />
        </Stack.Navigator>
    )
}