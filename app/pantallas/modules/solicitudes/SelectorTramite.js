import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native'
import { LinearProgress, Divider } from 'react-native-elements'
import useAxios from "../../../customhooks/useAxios"
import stylesGral from '../../../utils/StyleSheetGeneral'
import { createViewPortConfig } from 'react-native-responsive-view-port';
import { useNavigation } from "@react-navigation/native"
import estilosVar from '../../../utils/estilos'



const SelectorTramite = () => {
    const { vw, vh } = createViewPortConfig();
    const [Problematicas, setProblematicas] = React.useState({})
    const navigation = useNavigation()

    const { datos: datosProblematicas, loading: cargandoProblematicas, refetch: buscarProblematicas, err: errorProblematicas } = useAxios({
        method: 'post',
        url: '/rim/consultas/obtenerProblematicasNative'
    })

    React.useEffect(() => {
        if (datosProblematicas) {
            console.log('datosProblematicas', datosProblematicas)
            setProblematicas(datosProblematicas)
        }
    }, [datosProblematicas])

    const handleIniciarSolicitud = () => {
        navigation.navigate("nuevasolicitud")
    }

    const BotonNuevaSolicitud = () => {
        return (
            <View style={stylesGral.containerBtnGrande}>
                <TouchableOpacity onPress={() => { handleIniciarSolicitud() }} style={stylesGral.btnGrande}>
                    <Text style={stylesGral.textoBtnGrande}>Iniciar Solicitud</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleClickProblematica = (Prob) => {
        if (Prob.id_agenda) {
            navigation.navigate("SolicitarTurno", { Tramite: { id_agenda: Prob.id_agenda, oficina: Prob.agenda_oficina, tramite: Prob.agenda_tramite, observaciones: Prob.agenda_tramite_obs } })
        } else {
            navigation.navigate("nuevasolicitud")
        }
    }

    const ItemProblematica = (props) => {
        const Prob = props.item
        return (
            <>
                <TouchableOpacity onPress={() => { handleClickProblematica(Prob) }} >
                    <View style={styles.itemLista} >

                        <View style={{ maxWidth: 300 * vh }}>
                            <Text style={stylesGral.textBold}>{Prob.descripcion}</Text>
                            <Text >Oficina: {Prob.oficina}</Text>
                        </View>
                        <View>
                            {(Prob.id_agenda) ?
                                <Text style={[{ color: estilosVar.azulSuave }, { fontWeight: 'bold' }]}>TURNO</Text>
                                :
                                <Text style={[{ color: estilosVar.naranjaBitter }, { fontWeight: 'bold' }]}>FORMULARIO</Text>
                            }
                        </View>

                    </View>
                </TouchableOpacity>
                <Divider style={styles.divider} orientation="horizontal" />
            </>
        )
    }

    return (
        <ScrollView >
            <Text style={[stylesGral.tituloH3, stylesGral.textCentrado]}>Seleccione su trámite/solicitud</Text>
            {(typeof (datosProblematicas) !== 'undefined') &&
                <FlatList
                    // style={{ height: vh * 550 }}
                    data={datosProblematicas}
                    renderItem={ItemProblematica}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    ListEmptyComponent={<LinearProgress color="primary" style={{ width: "90%" }} />}
                />
            }
        </ScrollView>
    )
}

export default SelectorTramite

const styles = StyleSheet.create({
    itemLista: { paddingVertical: 10, paddingHorizontal: 5, flex: 1, justifyContent: 'space-between', flexDirection: 'row' },
    // tituloYBadge: { flex: 1, justifyContent: 'space-between', flexDirection: 'row' },
    divider: { marginTop: 0 }
})