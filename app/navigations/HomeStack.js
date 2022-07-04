import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Icon } from 'react-native-elements';
import Home from '../pantallas/home/Home';
import Logout from '../pantallas/cuenta/Logout';
import estilosVar from '../utils/estilos';
import TasasHome from '../pantallas/modules/tasas/TasasHome';
import Notificaciones from '../componentes/home/Notificaciones';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator()

export default function HomeStack() {
    const navigation = useNavigation();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ 
                    title: "Inicio",
                    headerRight: () => (
                        <Icon type="material-community" color={estilosVar.violetaOscuro} name="bell-outline" onPress={() => navigation.navigate("notifications")}/>
                    ),
                }}
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
                }}/>

            <Stack.Screen 
                name="tasasHome" 
                component={TasasHome} 
                options={{ title: "Tasas (Boletas)"}}/>

        </Stack.Navigator>
    )
}