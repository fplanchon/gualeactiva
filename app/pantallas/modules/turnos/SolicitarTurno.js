import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Icon, ScrollView, Button, FlatList, TouchableOpacity } from 'react-native'
import stylesGral from "../../../utils/StyleSheetGeneral";
import useAxios from "../../../customhooks/useAxios";
import estilosVar from "../../../utils/estilos";
import ModalComp from "../../../componentes/ModalComp";
import { AuthContext } from "../../../contexts/AuthContext";

export default function SolicitarTurno({ route }) {
    //const Turnera = props.Turno
    const { Tramite } = route.params;
    const [filtroInfoFecha, setFiltroInfoFecha] = useState(null)
    const [fechaDesc, setFechaDesc] = useState('')
    const [selectedId, setSelectedId] = useState(null);
    const [selectedHora, setSelectedHora] = useState(null);
    const [stateModalConfirmarTurno, setStateModalConfirmarTurno] = useState(false)
    const { authContext, loginState } = React.useContext(AuthContext)
    const loginStateJson = JSON.stringify(loginState)
    const [dataTurno, setDataTurno] = useState(null)

    const { datos: fechasDisp, err: errorFechasDisp, refetch: buscarFechasDisp } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/obtenerFechasDisponiblesAgenda',
        ejecutarEnInicio: true,
        data: { 'id_agenda': Tramite.id_agenda }
    })

    const { datos: infoFecha, setDatos: setInfoFecha, err: errorInfoFecha, refetch: buscarInfoFecha } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/obtenerInfoPorFechaNative',
        ejecutarEnInicio: false,
        data: filtroInfoFecha
    })


    const { datos: turnoGuardado, res: resTurnoGuardado, setDatos: setTurnoGuardado, err: errorTurnoGuardado, refetch: guardarTurno, limpiarStates: limpiarGuardarTurno } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/guardarturnoActiva',
        ejecutarEnInicio: false,
        data: dataTurno
    })
    /*useEffect(() => {
        console.log('fechasDisp', fechasDisp)
    }, [fechasDisp])*/


    /*useEffect(() => {
        console.log(' useEffect filtroInfoFecha')
        buscarInfoFecha()
    }, [filtroInfoFecha])*/

    /*useEffect(() => {
        setSelectedHora(null)
    }, [infoFecha])*/

    const handleSelectFecha = (itemSeleccionado) => {
        setSelectedId(itemSeleccionado.fecha_dmy)
        setFechaDesc(itemSeleccionado.desc)
        setFiltroInfoFecha({ 'id_agenda': Tramite.id_agenda, 'fecha': itemSeleccionado.fecha_dmy })
    }

    const handleVolverAFechas = () => {
        setSelectedHora(null)
        setSelectedId(null)
        setFechaDesc('')
        setFiltroInfoFecha(null)
        setInfoFecha('')
    }

    const handleSelectHora = (hora) => {
        setSelectedHora(hora)
        limpiarGuardarTurno()
    }


    const handleConfirmarTurno = () => {
        //console.log('handleConfirmarTurno')
        const id_agenda = Tramite.id_agenda
        const id_ciudadano = loginState.usuarioInfoFs.id_ciudadano
        const tipo = 'web'
        const nombre = loginState.usuarioInfoFs.nombres
        const apellido = loginState.usuarioInfoFs.apellido
        const tel = 0
        const cel = 0
        const mail = loginState.usuarioInfoFs.email
        const cuitcuil = loginState.usuarioInfoFs.cuitcuil
        const dni = cuitcuil.substr(2, 8)

        setDataTurno({
            id_agenda,
            id_ciudadano,
            tipo,
            nombre,
            apellido,
            tel,
            cel,
            mail,
            dni,
            'fecha_turno': selectedId,
            'hora_turno': selectedHora
        })
    }


    useEffect(() => {
        guardarTurno()
    }, [dataTurno])

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.touchItemFecha, backgroundColor]} >
            <Text style={[styles.textItemFecha, textColor]}>{item.desc}</Text>
        </TouchableOpacity >
    );

    const ItemHora = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.touchItemFecha, backgroundColor]} >
            <Text style={[styles.textItemFecha, textColor]}>{item}</Text>
        </TouchableOpacity >
    );

    const renderItem = ({ item }) => {
        const backgroundColor = item.fecha_dmy === selectedId ? estilosVar.colorIconoActivo : 'grey';
        const color = item.fecha_dmy === selectedId ? 'white' : 'white';

        return (
            <Item
                item={item}
                onPress={() => handleSelectFecha(item)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}

            />
        )
    }


    const renderItemHoras = ({ item }) => {
        const backgroundColor = item === selectedHora ? estilosVar.colorIconoActivo : 'grey';
        const color = item === selectedHora ? 'white' : 'white';

        return (
            <ItemHora
                item={item}
                onPress={() => handleSelectHora(item)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
                textStyle={{ textAlign: 'center' }}
            />
        )
    }

    const BottonConfirmarFecha = () => {
        const titulo = (fechaDesc !== '') ? "Confirmar fecha para " + fechaDesc : "Aún no ha seleccionado una fecha"
        return (
            <Button onPress={() => { buscarInfoFecha() }} title={titulo}></Button>
        )
    }


    const BottonConfirmarHora = () => {
        const titulo = (selectedHora !== null) ? "Confirmar horario para las " + selectedHora : "Aún no ha seleccionado un horario"
        return (
            <Button style={stylesGral.buttonMargin} onPress={() => { handleConfirmarHora(selectedHora) }} title={titulo}></Button>
        )
    }

    const BottonVolerAFechas = () => {
        return (
            <Button onPress={() => { handleVolverAFechas() }} title="Volver y cambiar la fecha"></Button>
        )
    }

    const BottonConfirmaTurno = () => {
        return (
            <Button onPress={() => { handleConfirmarTurno() }} title="Quiero confirmar mi turno"></Button>
        )
    }

    const handleConfirmarHora = (selectedHora) => {
        setStateModalConfirmarTurno(true)
    }

    const Cabecera = () => {
        return (

            <View style={[stylesGral.viewCard, stylesGral.elevation]}>
                <Text style={[stylesGral.tituloH2, stylesGral.tituloMargin]}>{Tramite.oficina}</Text>
                <Text style={[stylesGral.tituloH3, stylesGral.tituloMargin]}>{Tramite.tramite}</Text>
                <Text style={[stylesGral.tituloH5, stylesGral.tituloMargin]}>{Tramite.observaciones}</Text>
            </View>

        )
    }
    return (
        <ScrollView >

            <Cabecera />
            {infoFecha == '' ? (
                <>
                    <View style={[stylesGral.viewCard, stylesGral.elevation, stylesGral.viewCentrado, stylesGral.paddigVertical10]}>

                        <Text style={[stylesGral.tituloH5, stylesGral.tituloMargin]}>Seleccione una fecha</Text>

                        <FlatList
                            data={fechasDisp.topFechasDisponibles}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.fecha_ydm}
                            extraData={selectedId}
                            style={styles.widthFechas}
                            scrollEnabled={true}
                        />
                    </View>
                    <View>
                        <BottonConfirmarFecha />
                    </View>
                </>
            ) : (
                <>
                    <View style={[stylesGral.viewCard, stylesGral.elevation, stylesGral.viewCentrado, stylesGral.paddigVertical10]}>
                        <BottonVolerAFechas />
                        <Text style={[stylesGral.tituloH6, stylesGral.tituloMargin]}>Seleccione un horario</Text>
                        <FlatList
                            data={infoFecha.horasDisponibles}
                            renderItem={renderItemHoras}
                            keyExtractor={(item) => item}
                            extraData={selectedHora}
                            style={styles.widthHoras}
                        />
                    </View>
                    <View >
                        <BottonConfirmarHora />
                    </View>
                </>
            )
            }


            {stateModalConfirmarTurno &&
                <ModalComp stateModal={stateModalConfirmarTurno} setModalState={setStateModalConfirmarTurno} titulo="Confirmá tu turno">
                    <ScrollView>
                        <Cabecera />
                        <View style={[stylesGral.viewCard, stylesGral.elevation, stylesGral.paddigVertical10]}>
                            <Text style={styles.textItemFecha}>Fecha: {fechaDesc}</Text>
                            <Text style={styles.textItemFecha}>Hora: {selectedHora}</Text>
                            <Text>TURNOGUARDADO: {JSON.stringify(turnoGuardado)} </Text>
                            {(errorTurnoGuardado) ?
                                <>
                                    <Text style={stylesGral.errorText}>{errorTurnoGuardado}</Text>
                                </>
                                : null
                            }
                        </View>
                        <BottonConfirmaTurno />
                    </ScrollView>
                </ModalComp>
            }
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    textItemFecha: {
        fontWeight: "bold",
        marginVertical: 10,
        marginHorizontal: 5,
        textAlign: 'center'
    },
    touchItemFecha: {
        marginVertical: 1,
        borderRadius: 5,
    },
    scrollFechas: {
        height: 300
    },
    widthFechas: {
        minWidth: '90%',
        height: 300
    },
    widthHoras: {
        minWidth: '75%',
    }
})