import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { LinearProgress } from 'react-native-elements'

const HistorialSolicitud = (props) => {
    const Historial = props.Historial
    console.log(' Historial.length ', Historial.length)
    if (!Historial || Historial.length == 0) {
        return <Text>Historial...</Text>
    }

    return (
        <View >
            <Text>Historial: {JSON.stringify(Historial)}</Text>
        </View>
    )
}

export default HistorialSolicitud

const styles = StyleSheet.create({})