import React, { useState } from "react"
import { View, Text, Button, ScrollView } from "react-native";
import { AuthContext } from "../../contexts/AuthContext"
import axiosInstance from "../../utils/axiosInstance";
import useAxios from "../../customhooks/useAxios";
import Loading from "../../componentes/Loading";

export default function Home() {
    const [data, setData] = useState(null);
    const [pedir, setPedir] = useState(0);
    const { authContext, loginState } = React.useContext(AuthContext);
    const loginStateJson = JSON.stringify(loginState);

    const { res, err, loading, refetch } = useAxios({
        method: 'post',
        url: '/juegopreguntas/consultas/obtenerCategorias',
        data: {
            userId: 1,
            id: 19392,
            title: 'title',
            body: 'Sample text',
        },
    });

    React.useEffect(() => {
        if (pedir > 0) {
            refetch();
        }

        if (res !== null) {
            setData(res.data);
            console.log('home_useeffect')
            console.log(res.data)
        }
    }, [pedir]);


    /*React.useEffect(async () => {
        //const algo = await authContext.postAxios('/juegopreguntas/consultas/obtenerCategorias', { algo: 'eeea' })
        //const algo = await axiosInstance.post('/juegopreguntas/consultas/obtenerCategorias', { algo: 'qwerty' })
        
        if (algo) {
            console.log(algo);
        }

    }, [pedir]);*/

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
            <Button title="Cerrar Sesión" onPress={() => authContext.signOut()} />
            <Button title="Consultar" onPress={() => { setPedir(pedir + 1) }} />
            {loading ? (
                <Loading isLoading={true} text={"Consultando..."} />
            ) : null}
        </ScrollView>
    );

}