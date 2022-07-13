import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Icon } from 'react-native-elements';
import Home from '../pantallas/home/Home';
import Logout from '../pantallas/cuenta/Logout';
import Sandbox from '../pantallas/home/Sandbox'
import estilosVar from '../utils/estilos';
import TasasHome from '../pantallas/modules/tasas/TasasHome';
import Notificaciones from '../componentes/home/Notificaciones';
import { useNavigation } from '@react-navigation/native';
import { useUsrCiudadanoFirestore } from '../customhooks/useUsrCiudadanoFirestore';

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
    },[])

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: "Inicio",
                    headerRight: () => (
                        <Icon type="material-community" color={estilosVar.violetaOscuro} name="bell-outline" 
                            onPress={() => navigation.navigate("notifications", { id_ciudadano: id_ciudadano})} />
                    ),
                }}
            />
            <Stack.Screen
                name="Sandbox"
                component={Sandbox}
                options={{ title: "Sandbox" }}
            />
            <Stack.Screen
                name="Logout"
                component={Logout}
                options={{ title: "Logout" }}
            />
            <Stack.Screen
                name='notifications'
                component={Notificaciones}
                options={{
                    title: "Notificaciones",
                }} />

            <Stack.Screen
                name="tasasHome"
                component={TasasHome}
                options={{ title: "Tasas (Boletas)" }} />

        </Stack.Navigator>
    )
}