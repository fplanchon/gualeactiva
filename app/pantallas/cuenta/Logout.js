import React from "react"
import { ActivityIndicator } from "react-native";
import { AuthContext } from "../../contexts/AuthContext"


export default function Logout() {
    const { authContext } = React.useContext(AuthContext);

    React.useEffect(() => {
        authContext.signOut()
    }, [])


    return (
        <ActivityIndicator></ActivityIndicator>
    )
}