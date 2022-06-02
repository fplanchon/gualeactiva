import React, { useState } from "react"
import { View, Text, Button, ScrollView } from "react-native"
import { AuthContext } from "../../contexts/AuthContext"
import axiosInstance from "../../utils/axiosInstance"
import useAxios from "../../customhooks/useAxios"
import Loading from "../../componentes/Loading"
import { useFirestore } from "../../customhooks/useFirestore"
import { where } from "@firebase/firestore"
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore"

export default function Home() {
    const [data, setData] = useState(null)
    const [pedir, setPedir] = useState(0)
    //const [usuariosInfo, setUsuariosInfo] = useState([])
    const { data: dataFs, error: errorFs, loading: loadingFs, getDataColl, getDataDoc } = useFirestore()
    const { data: resSet, error: errorSet, loading: loadingSet, setDocument, deleteDocument } = useFirestore()
    // const { data: dataFs2, error: errorFs2, loading: loadingFs2, getDataDoc } = useFirestore()

    const { dataUsr, errorUsr, loadingUsr, getUsuario } = useUsrCiudadanoFirestore()

    const { authContext, loginState } = React.useContext(AuthContext)
    const loginStateJson = JSON.stringify(loginState)


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

    React.useEffect(async () => {
        if (pedir > 0) {
            refetch()

        }

        if (res !== null) {
            setData(res.data)
            //console.log('home_useeffect')
            //console.log(res.data)
        }
    }, [pedir])



    /*React.useEffect(async () => {
        //const algo = await authContext.postAxios('/juegopreguntas/consultas/obtenerCategorias', { algo: 'eeea' })
        //const algo = await axiosInstance.post('/juegopreguntas/consultas/obtenerCategorias', { algo: 'qwerty' })
        
        if (algo) {
            console.log(algo)
        }
    
    }, [pedir])*/

    return (
        <ScrollView>
            <Text>Context..! {loginStateJson}</Text>
            <Text>Pedir: {pedir}</Text>
            <Text>Loading: {(loading) ? 1 : 0}</Text>
            {loading ? (
                <Text>loading...</Text>
            ) : (

                err ? (

                    <Text>Error: {err.message}</Text>

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
            <Button title="Buscar Usrs Firebase" color="#66f4fa" onPress={() => getDataColl('usuariosInfo', [where('id_ciudadano', '==', 333)])} />
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