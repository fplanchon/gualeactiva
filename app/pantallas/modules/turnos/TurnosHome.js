import React, { useEffect, useState, useRef } from "react"
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { Button, Tab, TabView } from "react-native-elements"
import useAxios from "../../../customhooks/useAxios"
import stylesGral from "../../../utils/StyleSheetGeneral"
import { AuthContext } from "../../../contexts/AuthContext"
import { fechaIso2dmy } from "../../../utils/utilidades"
import { LinearProgress } from 'react-native-elements';
import estilosVar from "../../../utils/estilos"
import { createViewPortConfig } from 'react-native-responsive-view-port';
import ModalComp from "../../../componentes/ModalComp"
import Loading from "../../../componentes/Loading"
import BuscadorTramites from "../../../componentes/modules/turnos/BuscadorTramites"

const { vw, vh } = createViewPortConfig();


const TurnosHome = ({ navigation }) => {
    const { authContext, loginState } = React.useContext(AuthContext)
    const [turnerasData, setTurnerasData] = useState([{}])

    const [stateModalTramites, setStateModalTramites] = useState(false)


    const [idTurnoCancelar, setIdTurnoCancelar] = useState(false)
    const [turnoCancelar, setTurnoCancelar] = useState(false)
    const [stateModalCancelarTurno, setStateModalCancelarTurno] = useState(false)

    const [index, setIndex] = React.useState(0);//para tabs


    const id_ciudadano = loginState.usuarioInfoFs.id_ciudadano
    const { vw, vh } = createViewPortConfig();


    const { datos: misTurnos, loading: cargandoMisTurnos, refetch: buscarMisTurnos } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/obtenerMisTurnos',
        ejecutarEnInicio: false,
        data: { id_ciudadano: id_ciudadano }
    })

    const { datos: cancelarTurno, err: errorCancelarTurno, loading: cargandoCancelarTurno, refetch: ejecutarCancelarTurno } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/marcarTurnoActiva',
        ejecutarEnInicio: false,
        data: idTurnoCancelar
    })

    const handlePedirTurno = () => {
        setStateModalTramites(!stateModalTramites)
    }

    const handleModalCancelarTurno = (Turno) => {
        setTurnoCancelar(Turno)
        setStateModalCancelarTurno(true)

    }

    const handleCancelarTurno = (id_turno) => {
        setIdTurnoCancelar({ 'id_turno': id_turno })
    }

    useEffect(() => {
        navigation.addListener('focus', () => buscarMisTurnos())
    }, [])

    useEffect(() => {
        console.log('useEffect idTurnoCancelar')
        ejecutarCancelarTurno()
        setStateModalCancelarTurno(false)
    }, [idTurnoCancelar])

    useEffect(() => {
        if (cancelarTurno > 0) {
            buscarMisTurnos()
        }
    }, [cancelarTurno])



    const BotonQuieroTurno = () => {
        return (
            <View style={stylesGral.containerBtnGrande}>
                <TouchableOpacity onPress={() => { handlePedirTurno() }} style={stylesGral.btnGrande}>
                    <Text style={stylesGral.textoBtnGrande}>Quiero pedir un turno</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const turnoProximoModal = (item) => {
        return (
            <View key={item.item.id} style={[stylesGral.boxSimple, stylesGral.viewCentrado, { borderColor: estilosVar.verdeCyan }]}>
                <Text style={[stylesGral.textBold, { color: estilosVar.verdeCyan }]}>Trámite: {item.item.tramite}</Text>
                <Text style={stylesGral.textBoldGris}>Oficina: {item.item.oficina}</Text>
                <Text style={stylesGral.textBoldGris}>{fechaIso2dmy(item.item.fecha_turno) + ' ' + item.item.solo_hora}</Text>

                <Button
                    title="Cancelar"
                    buttonStyle={stylesGral.buttonStyleOutlineCancelar}
                    titleStyle={stylesGral.titleStyleCancelar}
                    reised={true}
                    type="outline"
                    icon={{
                        name: "close",
                        size: 15,
                        color: estilosVar.rojoCrayola
                    }}
                    onPress={() => { handleModalCancelarTurno(item.item) }}
                />
            </View>
        )
    }

    const turnoPasadoModal = (item) => {
        return (
            <View key={item.item.id} style={[stylesGral.boxSimple, stylesGral.viewCentrado]}>
                <Text style={stylesGral.textBoldGris}>Trámite: {item.item.tramite}</Text>
                <Text style={stylesGral.textBoldGris}>Oficina: {item.item.oficina}</Text>
                <Text style={stylesGral.textBoldGris}>{fechaIso2dmy(item.item.fecha_turno) + ' ' + item.item.solo_hora}</Text>
                <Text style={stylesGral.textBoldGris}>{item.item.estado.toUpperCase()}</Text>
            </View >
        )
    }

    const TurnosVacios = () => {
        return (
            <View style={styles.containerTextSinTurnos}>
                <Text style={styles.textSinTurnos}>Sin turnos pendientes.</Text>
                <Text style={styles.textSinTurnos}>Dale click al Boton "Quiero Pedir un turno"</Text>
                <Text style={styles.textSinTurnos}>A continuación, podrás elegir </Text>
                <Text style={styles.textSinTurnos}>el trámite, fecha, y hora </Text>
                <Text style={styles.textSinTurnos}>Revisá los requisitos del trámite antes de confirmar. </Text>
            </View>
        )
    }

    return (
        <>
            <View style={{ backgroundColor: estilosVar.azulSuave }}>
                <Tab value={index} onChange={setIndex} indicatorStyle={{ backgroundColor: 'white' }}>
                    <Tab.Item titleStyle={{ color: 'white' }} title="Futuros" />
                    <Tab.Item titleStyle={{ color: 'white' }} title="Pasados" />
                </Tab>
            </View>
            <TabView value={index} onChange={setIndex}  >
                <TabView.Item style={{ width: '100%' }}>
                    <View >
                        {(typeof (misTurnos.turnosProximos) !== 'undefined') &&
                            <FlatList
                                style={{ height: vh * 450 }}
                                data={misTurnos.turnosProximos}
                                renderItem={turnoProximoModal}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={true}
                                ListEmptyComponent={<TurnosVacios />}
                            />
                        }
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View >
                        {(typeof (misTurnos.turnosPasados) !== 'undefined') &&
                            <FlatList
                                style={{ height: vh * 450 }}
                                data={misTurnos.turnosPasados}
                                renderItem={turnoPasadoModal}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={true}
                                ListEmptyComponent={() => {
                                    <View style={styles.containerTextSinTurnos}>
                                        <Text style={styles.textSinTurnos}>Sin turnos</Text>
                                    </View>
                                }}
                            />
                        }
                    </View>
                </TabView.Item>
            </TabView>
            <BotonQuieroTurno />


            <ModalComp stateModal={stateModalTramites} setModalState={setStateModalTramites} titulo="Busca y elige tu trámite">
                <BuscadorTramites />
            </ModalComp>


            {stateModalCancelarTurno &&
                <ModalComp stateModal={stateModalCancelarTurno} setModalState={setStateModalCancelarTurno} titulo="Confirme" >
                    <View>
                        <Text style={[styles.textSinTurnos, stylesGral.textCentrado, { marginTop: 25 * vh }]}>¿Está seguro que desea cancelar el turno?</Text>
                    </View>
                    <View>
                        <Text style={[stylesGral.textBold, { color: estilosVar.verdeCyan }]}>Trámite: {turnoCancelar.tramite}</Text>
                        <Text style={stylesGral.textBoldGris}>Oficina: {turnoCancelar.oficina}</Text>
                        <Text style={stylesGral.textBoldGris}>{fechaIso2dmy(turnoCancelar.fecha_turno) + ' ' + turnoCancelar.solo_hora}</Text>
                        <Button
                            title="Sí, deseo Cancelar el turno"
                            buttonStyle={[stylesGral.buttonStyleOutlineCancelar, { marginTop: 25 * vh }]}
                            titleStyle={stylesGral.titleStyleCancelar}
                            reised={true}
                            type="outline"
                            icon={{
                                name: "close",
                                size: 15,
                                color: estilosVar.rojoCrayola
                            }}
                            onPress={() => { handleCancelarTurno(turnoCancelar.id) }}
                        />
                    </View>
                </ModalComp>
            }


            {cargandoCancelarTurno ? (
                <Loading isLoading={true} text={"Aguarde..."} />
            ) : null}
        </>
    )
}

export default TurnosHome

const styles = StyleSheet.create({
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    containerQuieroTurno: {
        alignItems: 'center',
        height: vh * 100,
        paddingBottom: 10
    },
    botonQuieroTurno: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: estilosVar.azulSuave,
        width: '90%',
        height: 100,
        borderRadius: 20
    },
    textoQuieroTurno: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30
    },
    containerVerTodos: {
        alignItems: 'center',
        height: vh * 50,
        paddingBottom: 5,
        width: '90%',
    },
    botonVerTodos: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 50,
        borderRadius: 20
    },
    textoVerTodo: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    containerTextSinTurnos: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textSinTurnos: {
        fontSize: 16,
        fontWeight: 'bold'
    }

})