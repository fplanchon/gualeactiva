import { useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import constantes from "../utils/constantes"

export const useNumeroCelular = () => {

    const setNumeroCelular = async (id_ciudadano, numero) => {
        const numeroCelular = await getNumeroCelular()
        console.log('setNumeroCelular numeroCelular', numeroCelular)

        if (!numeroCelular) {
            console.log('setNumeroCelular pasa', numeroCelular)
            await AsyncStorage.setItem(constantes.numCel, JSON.stringify({ id_ciudadano: id_ciudadano, numero: numero }))
        } else {
            console.log('setNumeroCelular else', numeroCelular)
            if (numeroCelular.id_ciudadano == id_ciudadano) {
                console.log('setNumeroCelular else if', numeroCelular)
                await AsyncStorage.setItem(constantes.numCel, JSON.stringify({ id_ciudadano: id_ciudadano, numero: numero }))
            }
        }
    }

    const getNumeroCelular = async () => {
        const numeroCelular = JSON.parse(await AsyncStorage.getItem(constantes.numCel))
        console.log(' getNumeroCelular numeroCelular', numeroCelular)
        if (!numeroCelular) {
            return null
        } else {
            return numeroCelular
        }

    }

    const removeNumeroCelular = async () => {
        await AsyncStorage.removeItem(constantes.numCel)
    }

    return {
        setNumeroCelular,
        getNumeroCelular,
        removeNumeroCelular
    }
}