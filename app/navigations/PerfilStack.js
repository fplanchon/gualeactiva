import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Perfil from "../pantallas/cuenta/Perfil"
import AjustesNotificaciones from '../pantallas/cuenta/perfil/AjustesNotificaciones';

const Stack = createNativeStackNavigator()

export default function PerfilStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="miperfil"
                component={Perfil}
                options={{ title: "Mi perfil" }}
            />
            <Stack.Screen
                name="ajustesnotificaciones"
                component={AjustesNotificaciones}
                options={{ title: "Ajustes Notificaciones" }}
            />

        </Stack.Navigator>
    )
}