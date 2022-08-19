import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from '../pantallas/cuenta/Login';
import Registro from '../pantallas/cuenta/Registro';
import Logout from '../pantallas/cuenta/Logout';
import stylesGral from '../utils/StyleSheetGeneral';

const Stack = createNativeStackNavigator()

const opcionesComunesStackScreen = {

    headerStyle: stylesGral.headerStyle, headerTintColor: 'white', headerTitleStyle: stylesGral.headerTitleStyle
}

export default function LoginStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                    // title: 'Iniciar Sesion',
                    // When logging out, a pop animation feels intuitive
                    animationTypeForReplace: 'push',
                    ...opcionesComunesStackScreen
                }}
            />
            <Stack.Screen
                name="registro"
                component={Registro}
                options={{ title: "Registro", ...opcionesComunesStackScreen }}
            />
        </Stack.Navigator>
    )
}