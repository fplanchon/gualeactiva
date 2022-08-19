import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { Card, Input, Icon, Button } from "react-native-elements"
import useAxios from "../../../customhooks/useAxios"
import ItemAccordion from "../../../componentes/modules/turnos/ItemAccordion"
import stylesGral from "../../../utils/StyleSheetGeneral"
import { AuthContext } from "../../../contexts/AuthContext"
import { fechaIso2dmy } from "../../../utils/utilidades"
import { LinearProgress } from 'react-native-elements';
import estilosVar from "../../../utils/estilos"
import { createViewPortConfig } from 'react-native-responsive-view-port';
import ModalComp from "../../../componentes/ModalComp"
import Loading from "../../../componentes/Loading"


const { vw, vh } = createViewPortConfig();


const TurnosHome = ({ navigation }) => {
    const { authContext, loginState } = React.useContext(AuthContext)
    const [turnerasData, setTurnerasData] = useState([{}])
    const [buscarTurneraTxt, setBuscarTurneraTxt] = useState('')
    const [buscarTurneraFiltro, setBuscarTurneraFiltro] = useState({ tramite: '' })
    const [stateModalTramites, setStateModalTramites] = useState(false)
    const [stateModalTProximos, setStateModalTProximos] = useState(false)
    const [stateModalTPasados, setStateModalTPasados] = useState(false)
    const [idTurnoCancelar, setIdTurnoCancelar] = useState(false)
    const [turnoCancelar, setTurnoCancelar] = useState(false)
    const [stateModalCancelarTurno, setStateModalCancelarTurno] = useState(false)

    const id_ciudadano = loginState.usuarioInfoFs.id_ciudadano
    const { vw, vh } = createViewPortConfig();
    const { datos: Turneras, err: errorTurneras, refetch: buscarTurneras } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/buscarTurnosPorTramiteNative',
        data: buscarTurneraFiltro
    })

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

    const handleBuscaTurnera = (e) => {
        setBuscarTurneraTxt(e.nativeEvent.text)
    }

    const handlePedirTurno = () => {
        setStateModalTramites(!stateModalTramites)
    }

    const handleVerTodosTurnosPasados = () => {
        setStateModalTPasados(!stateModalTPasados)
    }

    const handleVerTodosProximosTurnos = () => {
        setStateModalTProximos(!stateModalTProximos)
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
        //console.log('useEffect buscarTurneraTxt')
        setBuscarTurneraFiltro({ tramite: buscarTurneraTxt })
    }, [buscarTurneraTxt])

    useEffect(() => {
        //console.log('useEffect buscarTurneraFiltro')
        buscarTurneras()
    }, [buscarTurneraFiltro])

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

    const proximoTurno = ({ item }) => {
        return (
            <View key={item.id} style={[stylesGral.boxSimple, stylesGral.viewCentrado, { borderColor: estilosVar.verdeCyan }, { backgroundColor: estilosVar.verdeCyan }]}>
                <Text style={stylesGral.textBoldBlanco}>{item.tramite}</Text>

                <Text style={stylesGral.textBoldBlanco}>Oficina: {item.oficina}</Text>
                <Text style={stylesGral.textBoldBlanco}>{fechaIso2dmy(item.fecha_turno) + ' ' + item.solo_hora}</Text>
            </View>
        )
    }


    const turnoPasado = ({ item }) => {
        return (
            <View key={item.id} style={[stylesGral.boxSimple, stylesGral.viewCentrado]}>
                <Text style={stylesGral.textBoldGris}> {item.tramite}</Text>
                <Text style={stylesGral.textBoldGris}>Oficina: {item.oficina}</Text>
                <Text style={stylesGral.textBoldGris}>{fechaIso2dmy(item.fecha_turno) + ' ' + item.solo_hora}</Text>
            </View >
        )
    }

    const ProximosTurnos = () => {
        let turnosProximos = []
        if (typeof (misTurnos.turnosProximos) !== 'undefined') {
            if (misTurnos.turnosProximos.length > 0) {
                turnosProximos.push(misTurnos.turnosProximos[0])
            }
        }
        //console.log('turnosProximos', turnosProximos)
        return (
            <View style={[stylesGral.viewCard, stylesGral.elevation, stylesGral.viewCentrado, stylesGral.paddigVertical10]}>
                <Text style={[stylesGral.tituloH3, stylesGral.textBold, { color: estilosVar.verdeCyan }]}>Proximos Turnos</Text>
                {cargandoMisTurnos ?
                    <LinearProgress color="primary" />
                    :
                    turnosProximos.length > 0 ?
                        <>
                            <FlatList
                                style={{ height: 100 }}
                                data={turnosProximos}
                                renderItem={proximoTurno}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={true}
                            />
                            <BotonVerTodosProximosTurnos />
                        </>
                        :
                        <View style={styles.containerTextSinTurnos}>
                            <Text style={styles.textSinTurnos}>Sin turnos</Text>
                        </View>
                }

            </View>
        )
    }
    const TurnosPasados = () => {
        let turnosPasados = []
        if (typeof (misTurnos.turnosPasados) !== 'undefined') {
            if (misTurnos.turnosPasados.length > 0) {
                turnosPasados.push(misTurnos.turnosPasados[0])
            }
        }

        return (
            <View style={[stylesGral.viewCard, stylesGral.elevation, stylesGral.viewCentrado, stylesGral.paddigVertical10]}>
                <Text style={[stylesGral.tituloH3, stylesGral.textBoldGris]}>Turnos Pasados</Text>
                {cargandoMisTurnos ?
                    <LinearProgress color="primary" />
                    :
                    turnosPasados.length > 0 ?
                        <>
                            <FlatList
                                style={{ height: 100 }}
                                data={turnosPasados}
                                renderItem={turnoPasado}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={true}

                            />
                            <BotonVerTodosTurnosPasados />
                        </>
                        :
                        <View style={styles.containerTextSinTurnos}>
                            <Text style={styles.textSinTurnos}>Sin turnos</Text>
                        </View>
                }

            </View>
        )
    }

    const BuscadorTramites = () => {
        return (
            <View style={[stylesGral.viewCard, stylesGral.elevation, { height: vh * 500 }]}>
                <Input
                    placeholder="Buscá tu trámite"
                    containerStyle={styles.inputForm}
                    value={buscarTurneraTxt}
                    rightIcon={
                        <Icon
                            type="material"
                            name="search"
                            iconStyle={styles.iconoGris}
                        />
                    }
                    leftIcon={
                        <Icon
                            type="material"
                            name="close"
                            onPress={() => (
                                setBuscarTurneraTxt('')
                            )}
                        />
                    }
                    onChange={(e) => handleBuscaTurnera(e)}
                />
                <ScrollView>
                    {Turneras ? Turneras.map((Turnera, i) => (
                        <ItemAccordion key={i} Turnera={Turnera} ></ItemAccordion>
                    )) : null
                    }
                </ScrollView>
            </View>
        )
    }

    const BotonQuieroTurno = () => {
        return (
            <View style={stylesGral.containerBtnGrande}>
                <TouchableOpacity onPress={() => { handlePedirTurno() }} style={stylesGral.btnGrande}>
                    <Text style={stylesGral.textoBtnGrande}>Quiero pedir un turno</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const BotonVerTodosTurnosPasados = () => {
        return (
            <View style={styles.containerVerTodos}>
                <TouchableOpacity onPress={() => { handleVerTodosTurnosPasados() }} style={[styles.botonVerTodos, { backgroundColor: estilosVar.colorIconoInactivo }]}>
                    <Text style={styles.textoVerTodo}>Ver todos</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const BotonVerTodosProximosTurnos = () => {
        return (
            <View style={styles.containerVerTodos}>
                <TouchableOpacity onPress={() => { handleVerTodosProximosTurnos() }} style={[styles.botonVerTodos, { backgroundColor: estilosVar.verdeCyan }]}>
                    <Text style={styles.textoVerTodo}>Ver todos</Text>
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

    return (
        <>
            <ProximosTurnos />
            <TurnosPasados />
            <BotonQuieroTurno />
            {stateModalTramites &&
                <ModalComp stateModal={stateModalTramites} setModalState={setStateModalTramites} titulo="Busca y elige tu trámite">
                    <BuscadorTramites />
                </ModalComp>
            }

            {stateModalTProximos &&
                <ModalComp stateModal={stateModalTProximos} setModalState={setStateModalTProximos} titulo="Próximos Turnos">

                    {(typeof (misTurnos.turnosProximos) !== 'undefined') ?
                        <FlatList
                            style={{ height: vh * 600 }}
                            data={misTurnos.turnosProximos}
                            renderItem={turnoProximoModal}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={true}
                        />

                        :
                        <View style={styles.containerTextSinTurnos}>
                            <Text style={styles.textSinTurnos}>Sin turnos</Text>
                        </View>
                    }
                </ModalComp>
            }

            {stateModalTPasados &&
                <ModalComp stateModal={stateModalTPasados} setModalState={setStateModalTPasados} titulo="Turnos Pasados">
                    {(typeof (misTurnos.turnosPasados) !== 'undefined') ?
                        <FlatList
                            style={{ height: vh * 600 }}
                            data={misTurnos.turnosPasados}
                            renderItem={turnoPasadoModal}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={true}
                        />
                        :
                        <View style={styles.containerTextSinTurnos}>
                            <Text style={styles.textSinTurnos}>Sin turnos</Text>
                        </View>
                    }
                </ModalComp>
            }

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