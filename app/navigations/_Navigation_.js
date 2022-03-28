import { View, Text, Button } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Icon } from "react-native-elements"
import estilos from "../utils/estilos"

import Login from "../pantallas/cuenta/Login"
import Splash from "../pantallas/Splash"
import HomeStack from "./HomeStack"
import MenuStack from "./MenuStack"

/*              <Tab.Screen name="home-stack" component={HomeStack} options={{ title: "Home", headerShown: false }} />
*/

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export default function Navigation() {

    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            try {
                // Restore token stored in `SecureStore` or any other encrypted storage
                //userToken = await SecureStore.getItemAsync('userToken');
            } catch (e) {
                // Restoring token failed
            }

            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();
    }, []);

    return (



        <NavigationContainer>


            {state.isLoading ? (
                <Stack.Navigator>

                    <Stack.Screen name="Splash" component={Splash} />
                </Stack.Navigator>
            ) : state.userToken == null ? (
                // No token found, user isn't signed in
                <Stack.Navigator>
                    <Stack.Screen
                        name="SignIn"
                        component={Login}
                        options={{
                            title: 'Log in',
                            // When logging out, a pop animation feels intuitive
                            animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                        }}
                    />
                </Stack.Navigator>
            ) : (
                // User is signed in
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarInactiveTintColor: estilos.colorMenuPpalInactivo.color,
                        tabBarActiveTintColor: estilos.colorMenuPpalActivo.color,
                        tabBarIcon: ({ color }) => screenOption(route, color)
                    })}
                >
                    <Tab.Screen name="home-stack" component={HomeStack} options={{ title: "Home", headerShown: false }} />

                    <Tab.Screen name="menu-stack" component={MenuStack} options={{ title: "Menu", headerShown: false }} />

                </Tab.Navigator>
            )}


        </NavigationContainer>
    )
}

function screenOption(route, color) {
    let iconName;

    switch (route.name) {

        case "menu-stack":
            iconName = "menu";
            break;
        case "home-stack":
            iconName = "home";
            break;
        case "login-stack":
            iconName = "account";
            break;
        default:
            break;
    }

    return <Icon type="material-community" name={iconName} size={22} color={color} />
}