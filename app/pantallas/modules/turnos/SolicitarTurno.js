import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, ScrollView, Button, FlatList, TouchableOpacity } from 'react-native'
import stylesGral from "../../../utils/StyleSheetGeneral";
import useAxios from "../../../customhooks/useAxios";
import estilosVar from "../../../utils/estilos";
import ModalComp from "../../../componentes/ModalComp";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";


export default function SolicitarTurno({ route }) {
    //const Turnera = props.Turno
    const { Tramite } = route.params;
    const [filtroInfoFecha, setFiltroInfoFecha] = useState(null)
    const [fechaDesc, setFechaDesc] = useState('')
    const [selectedId, setSelectedId] = useState(null);
    const [selectedHora, setSelectedHora] = useState(null);
    const [stateModalConfirmarTurno, setStateModalConfirmarTurno] = useState(false)
    const [stateModalTurnoGuardado, setStateModalTurnoGuardado] = useState(false)
    const { authContext, loginState } = React.useContext(AuthContext)
    const loginStateJson = JSON.stringify(loginState)
    const [dataTurno, setDataTurno] = useState(null)
    const navigation = useNavigation()

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
        console.log('turnoGuardado', turnoGuardado)
        if ((turnoGuardado != null) && (typeof turnoGuardado != 'undefined')) {
            if ((turnoGuardado.turno != null) && (typeof turnoGuardado.turno != 'undefined')) {
                setStateModalConfirmarTurno(false)
                setStateModalTurnoGuardado(true)
            }
        }
    }, [turnoGuardado])

    useEffect(() => {
        guardarTurno()
    }, [dataTurno])



    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity key={item.id} onPress={onPress} style={[styles.touchItemFecha, backgroundColor]} >
            <Text style={[styles.textItemFecha, textColor]}>{item.desc}</Text>
        </TouchableOpacity >
    );

    const ItemHora = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity key={item} onPress={onPress} style={[styles.touchItemFecha, backgroundColor]} >
            <Text style={[styles.textItemFecha, textColor]}>{item}</Text>
        </TouchableOpacity >
    );

    const renderItem = ({ item }) => {
        const backgroundColor = item.fecha_dmy === selectedId ? estilosVar.colorIconoActivo : 'grey';
        const color = item.fecha_dmy === selectedId ? 'white' : 'white';

        return (
            <Item
                key={item.id}
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

    const handleConfirmarHora = () => {
        setStateModalConfirmarTurno(true)
    }

    const handleCerrarTurno = () => {
        navigation.navigate("turnosHome")
    }

    const BotonConfirmarFecha = () => {
        const titulo = (fechaDesc !== '') ? "Confirmar fecha para " + fechaDesc : "Aún no ha seleccionado una fecha"
        return (
            <View style={[stylesGral.containerBtnGrande, { height: 75 }]}>
                <TouchableOpacity onPress={() => { buscarInfoFecha() }} style={stylesGral.btnGrande}>
                    <Text style={[stylesGral.textoBtnGrande, { fontSize: 14 }]}>{titulo}</Text>
                </TouchableOpacity>
            </View >
        )
    }


    const BotonConfirmarHora = () => {
        const titulo = (selectedHora !== null) ? "Confirmar horario para las " + selectedHora : "Aún no ha seleccionado un horario"
        return (
            <View style={[stylesGral.containerBtnGrande, { height: 75 }]}>
                <TouchableOpacity onPress={() => { handleConfirmarHora() }} style={stylesGral.btnGrande}>
                    <Text style={[stylesGral.textoBtnGrande, { fontSize: 16 }]}>{titulo}</Text>
                </TouchableOpacity>
            </View >
        )
    }

    const BotonVolerAFechas = () => {
        const titulo = "Volver y cambiar la fecha"
        return (
            <View >
                <TouchableOpacity style={stylesGral.iconRow} onPress={() => { handleVolverAFechas() }} >
                    <Icon type="material-community" name={"arrow-left-bold"} size={16} color={estilosVar.azulSuave} />
                    <Text style={[{ color: estilosVar.azulSuave }, { fontWeight: 'bold' }, { fontSize: 16 }]}>{titulo}</Text>
                </TouchableOpacity>
            </View >
        )
    }

    const BotonConfirmaTurno = () => {
        const titulo = "Quiero confirmar mi turno"
        return (
            <View style={[stylesGral.containerBtnGrande, { height: 75 }]}>
                <TouchableOpacity onPress={() => { handleConfirmarTurno() }} style={stylesGral.btnGrande}>
                    <Text style={[stylesGral.textoBtnGrande, { fontSize: 16 }]}>{titulo}</Text>
                </TouchableOpacity>
            </View >
        )
    }


    const BotonCerrarTurno = () => {
        const titulo = "Listo"
        return (
            <View style={[stylesGral.containerBtnGrande, { height: 75 }]}>
                <TouchableOpacity onPress={() => { handleCerrarTurno() }} style={stylesGral.btnGrande}>
                    <Text style={[stylesGral.textoBtnGrande, { fontSize: 16 }]}>{titulo}</Text>
                </TouchableOpacity>
            </View >
        )
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
        <>
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

                    <BotonConfirmarFecha />

                </>
            ) : (
                <>
                    <View style={[stylesGral.viewCard, stylesGral.elevation, stylesGral.viewCentrado, stylesGral.paddigVertical10]}>
                        <BotonVolerAFechas />
                        <Text style={[stylesGral.tituloH6, stylesGral.tituloMargin]}>Seleccione un horario</Text>
                        <FlatList
                            data={infoFecha.horasDisponibles}
                            renderItem={renderItemHoras}
                            keyExtractor={(item) => item}
                            extraData={selectedHora}
                            style={styles.widthHoras}
                            scrollEnabled={true}
                        />
                    </View>

                    <BotonConfirmarHora />

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
                            {(errorTurnoGuardado) ?
                                <>
                                    <Text style={stylesGral.errorText}>{errorTurnoGuardado}</Text>
                                </>
                                : null
                            }
                        </View>
                        <BotonConfirmaTurno />
                    </ScrollView>
                </ModalComp>
            }

            {stateModalTurnoGuardado &&
                <ModalComp stateModal={stateModalTurnoGuardado} setModalState={setStateModalTurnoGuardado} ocultarIconClose={true} titulo="Turno confirmado!!!">
                    <ScrollView>
                        <Cabecera />
                        <View style={[stylesGral.viewCard, stylesGral.elevation, stylesGral.paddigVertical10]}>
                            <Text style={styles.textItemFecha}>Fecha: {fechaDesc}</Text>
                            <Text style={styles.textItemFecha}>Hora: {selectedHora}</Text>
                            <Text>Recorda asistir con la documentacion solicitada, cancela el turno si prevees que no asistiras</Text>
                            <Text>Gracias por utilizar este servicio</Text>

                        </View>
                        <BotonCerrarTurno />
                    </ScrollView>
                </ModalComp>
            }
        </>



    )
}

const styles = StyleSheet.create({
    textItemFecha: {
        fontSize: 16,
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