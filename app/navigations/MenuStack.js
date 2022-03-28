import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MenuPpal from '../pantallas/menu/MenuPpal';


const Stack = createNativeStackNavigator()

export default function MenuStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="menuppal"
                component={MenuPpal}
                options={{ title: "Menu" }}
            />

        </Stack.Navigator>
    )
}