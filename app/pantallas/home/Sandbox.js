import React, { useState, useRef } from "react"
import { View, Text, Button, ScrollView } from "react-native"
import { AuthContext } from "../../contexts/AuthContext"
//import axiosInstance from "../../utils/axiosInstance"
import useAxios from "../../customhooks/useAxios"
import Loading from "../../componentes/Loading"
import { useFirestore } from "../../customhooks/useFirestore"
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore"
import constantes from "../../utils/constantes"
import axios from "axios"
import * as Notifications from 'expo-notifications';
import { useNumeroCelular } from "../../customhooks/useNumeroCelular"

export default function Sandbox() {
    const [data, setData] = useState(null)
    const [pedir, setPedir] = useState(0)
    //const [usuariosInfo, setUsuariosInfo] = useState([])
    const { data: dataFs, error: errorFs, loading: loadingFs, getDataColl, getDataDoc } = useFirestore()
    const { data: resSet, error: errorSet, loading: loadingSet, setDocument, deleteDocument } = useFirestore()
    const { recuperarDatosDeSesion } = useUsrCiudadanoFirestore();

    const { dataUsr, errorUsr, loadingUsr, getUsuario } = useUsrCiudadanoFirestore()

    const { authContext, loginState } = React.useContext(AuthContext)
    const loginStateJson = JSON.stringify(loginState)

    const notificationListener = useRef();
    const responseListener = useRef();

    const { setNumeroCelular, getNumeroCelular, removeNumeroCelular } = useNumeroCelular()
    const [stateNumero, setStateNumero] = useState(false)

    const { res, err, loading, refetch } = useAxios({
        method: 'post',
        url: '/juegopreguntas/consultas/obtenerCategorias',
        data: {
            userId: 1,
            id: 19392,
            title: 'title',
            body: 'Sample text',
        },
    })

    const enviarNotificacion = async () => {
        const url = constantes.API + 'notificarActiva';
        const { usuarioInfo } = await recuperarDatosDeSesion('SandBox->enviarNotificacion');
        const datos = { titulo: "Notificacion de prueba", contenido: "Cuerpo notificacion", link: "Sandbox", modulo: "RIM", id_ciudadano: usuarioInfo.id_ciudadano };
        const response = await axios.post(url, datos);
        //console.log("RTA:", response)
    }

    React.useEffect(async () => {
        if (pedir > 0) {
            refetch()
        }

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('sandbox addNotificationReceivedListener', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('sandbox addNotificationResponseReceivedListener', response);
        });



        if (res !== null) {
            setData(res.data)
            //console.log('home_useeffect')
            //console.log(res.data)
        }

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, [pedir]);

    React.useEffect(async () => {
        setStateNumero(await getNumeroCelular())

    }, [])


    const setearNumero = async () => {
        await setNumeroCelular('35741', '3446508238')
        setStateNumero(await getNumeroCelular())
        //removeNumeroCelular()
    }

    const removerNumero = async () => {
        removeNumeroCelular()
    }

    return (
        <ScrollView>
            <Text>SANDBOX</Text>
            <Text>StateNumero {JSON.stringify(stateNumero)}</Text>
            <Button title="Set Numero Cel" onPress={() => setearNumero()} />

            <Button title="removerNumero" onPress={() => removerNumero()} />

            <Text>Context..! {loginStateJson}</Text>
            <Text>Pedir: {pedir}</Text>
            <Text>Loading: {(loading) ? 1 : 0}</Text>
            {loading ? (
                <Text>loading...</Text>
            ) : (

                err ? (

                    <Text>Error: {JSON.stringify(err)}</Text>

                ) :
                    (<Text>{JSON.stringify(data)}</Text>)

            )}

            <Text>****USUARIOS****</Text>
            {loadingFs ? (
                <Text>loading Firestore...</Text>
            ) : (
                errorFs ? (
                    <Text>Error Firestore: {errorFs}</Text>
                ) :
                    (<Text>{JSON.stringify(dataFs)}</Text>)
            )}
            <Text>****/USUARIOS****</Text>

            <Button title="Cerrar Sesión" onPress={() => authContext.signOut()} />
            <Button title="Consultar" onPress={() => { setPedir(pedir + 1) }} />
            <Button title="Buscar Usrs Firebase" color="#66f4fa" onPress={() => getDataColl('usuariosInfo')} />
            <Button title="Buscar un Usuario" color="#4fa" onPress={() => getDataDoc('usuariosInfo', 'zDB2P3ZXqkdSJBjZSs07DHLtCqs1')} />

            <Text>****SETTER****</Text>
            {loadingSet ? (
                <Text>loading Firestore...</Text>
            ) : (
                errorSet ? (
                    <Text>Error Firestore: {errorSet}</Text>
                ) :
                    (<Text>{JSON.stringify(resSet)}</Text>)
            )}
            <Text>****/SETTER****</Text>

            <Button title="Set Usuario" color="#ff4444" onPress={() => setDocument('usuariosInfo', 'zDB2P3ZXqkdSJBjZSs07DHLtCqs1', { id_ciudadano: 999, nombres: 'aww' })} />
            <Button title="Borrar un Usuario" color="#ff4" onPress={() => deleteDocument('usuariosInfo', 'zDB2P3ZXqkdSJBjZSs07DHLtCqs1')} />
            {loading ? (
                <Loading isLoading={true} text={"Consultando..."} />
            ) : null}
            <Button title="Buscar usuario useUsrCiudadanoFirestore" color="#442" onPress={() => getUsuario().then(() => { console.log('ok useusr') })} />
            <Button title="Enviar Notificación" color="#e26f48" onPress={() => enviarNotificacion()} />

            <Text>****useUsrCiudadanoFirestore****</Text>
            {loadingUsr ? (
                <Text>loading useUsrCiudadanoFirestore...</Text>
            ) : (
                errorUsr ? (
                    <Text>Error useUsrCiudadanoFirestore: {errorUsr}</Text>
                ) :
                    (<Text>{JSON.stringify(dataUsr)}</Text>)
            )}
            <Text>****/useUsrCiudadanoFirestore****</Text>



        </ScrollView>
    )

}