import React, { useState } from "react"
import { View, FlatList, Button, ScrollView, StyleSheet, Dimensions } from "react-native"
import { Image } from "react-native-elements"
import { AuthContext } from "../../contexts/AuthContext"
import axiosInstance from "../../utils/axiosInstance"
import useAxios from "../../customhooks/useAxios"
import Loading from "../../componentes/Loading"
import { useFirestore } from "../../customhooks/useFirestore"
import { where } from "@firebase/firestore"
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore"
import ButtonHome from "../../componentes/home/ButtonHome"
import stylesGral from "../../utils/StyleSheetGeneral"
import estilosVar from "../../utils/estilos"
import { useNavigation } from "@react-navigation/native"

export default function Home() {
    const navigation = useNavigation()
    /*const [data, setData] = useState(null)
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



    React.useEffect(async () => {
        //const algo = await authContext.postAxios('/juegopreguntas/consultas/obtenerCategorias', { algo: 'eeea' })
        //const algo = await axiosInstance.post('/juegopreguntas/consultas/obtenerCategorias', { algo: 'qwerty' })
        
        if (algo) {
            console.log(algo)
        }
    
    }, [pedir])*/

    const buttons = [
        { id: 1,icon: "file", title: "Trámites" },
        { id: 2,icon: "calendar", title: "Turnos" },
        { id: 3,icon: "file-document", title: "Tasas (boletas)", onPress: () => navigation.navigate("tasasHome")},
        { id: 4,icon: "ticket", title: "Multas" },
    ]

    const WIDTH = Dimensions.get("window").width;
    const column = 2
    const buttonWidth = WIDTH / column;
    
    return (
        <View>
            <View style={styles.encabezadoLogo}>
                <Image style={{width:"100%",height:100, marginTop: 70}} resizeMode="contain" source={require("../../../assets/logo-gualeactiva.png")} />
            </View>
            <View style={styles.viewStyle}>
                <FlatList
                    data={buttons}
                    renderItem={({ item }) => {
                        return <ButtonHome key={item.id} widthBtn={buttonWidth} icon={item.icon} title={item.title} onPress={item.onPress}/>
                    }}
                    keyExtractor={(item) => item.id}
                    numColumns={column}
                />
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    viewStyle: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: 'flex-start',
        height: Dimensions.get("window").height
    },
    encabezadoLogo: {
        backgroundColor: estilosVar.violetaOscuro,
        width: "100%",
        height: 228
    }
})