import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from '../pantallas/cuenta/Login';
import Registro from '../pantallas/cuenta/Registro';
import Logout from '../pantallas/cuenta/Logout';

const Stack = createNativeStackNavigator()

export default function LoginStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: 'Iniciar Sesion',
                    // When logging out, a pop animation feels intuitive
                    animationTypeForReplace: 'push',
                }}
            />
            <Stack.Screen
                name="registro"
                component={Registro}
                options={{ title: "Registro" }}
            />
        </Stack.Navigator>
    )
}