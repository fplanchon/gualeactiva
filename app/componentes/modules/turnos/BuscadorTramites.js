import React, { useEffect, useState, useRef } from "react"
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Icon, Input } from "react-native-elements"
import ItemAccordion from "../../../componentes/modules/turnos/ItemAccordion"
import useAxios from "../../../customhooks/useAxios"
import ModalComp from "../../../componentes/ModalComp"
import RadioGroup from 'react-native-radio-buttons-group'
import stylesGral from "../../../utils/StyleSheetGeneral"
import { createViewPortConfig } from 'react-native-responsive-view-port'
import { stringify } from "@firebase/util"

const { vw, vh } = createViewPortConfig();

export default function BuscadorTramites() {
    const TurneraFiltroInicial = { tramite: '' }
    const [buscarTurneraTxt, setBuscarTurneraTxt] = useState('')
    const [buscarTurneraFiltro, setBuscarTurneraFiltro] = useState(TurneraFiltroInicial)
    const [stateModalChkOficinas, setStateModalChkOficinas] = useState(false)
    const [expandir, setExpandir] = useState(false)
    const [ofiCheck, setOfiCheck] = useState([])

    const { datos: Turneras, err: errorTurneras, refetch: buscarTurneras } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/buscarTurnosPorTramiteNative',
        data: buscarTurneraFiltro
    })

    const { datos: OficinasAgrupadoras, err: errorOfi, refetch: buscarOficinasAgrupadoras } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/obtenerOficinasAgrupadoras'
    })


    const [radioButtons, setRadioButtons] = useState([]);

    function onPressRadioButton(radioButtonsArray) {
        console.log('radioButtonsArray', radioButtonsArray)
        setOfiCheck(radioButtonsArray)
    }

    /*
    <ScrollView >
        {Turneras ? Turneras.map((Turnera, i) => (
            <ItemAccordion key={i} Turnera={Turnera} estadoExpandir={estadoExpandir} ></ItemAccordion>
        )) : null
        }
    </ScrollView>
                */
    const handleBuscaTurnera = (e) => {
        setBuscarTurneraTxt(e.nativeEvent.text)
    }

    const blanquearFiltro = () => {
        setBuscarTurneraTxt('')
        setBuscarTurneraFiltro(TurneraFiltroInicial)
    }

    useEffect(() => {
        console.log('ofiCheck', ofiCheck)
    }, [ofiCheck])

    useEffect(() => {
        //console.log('useEffect Turneras', Turneras.length, buscarTurneraFiltro)
    }, [Turneras])

    useEffect(() => {
        //console.log('useEffect buscarTurneraTxt', buscarTurneraTxt.length)
        if (buscarTurneraTxt.length >= 3) {
            console.log('Busco ln + 3')
            setBuscarTurneraFiltro({ tramite: buscarTurneraTxt })
        } else if (buscarTurneraTxt.length == 0) {
            setBuscarTurneraFiltro(TurneraFiltroInicial)
        }
    }, [buscarTurneraTxt])

    useEffect(() => {
        //console.log('useEffect buscarTurneraFiltro')
        buscarTurneras()
        setExpandir(estadoExpandir())
    }, [buscarTurneraFiltro])


    useEffect(() => {
        console.log('Expandir', expandir)
    }, [expandir])

    useEffect(() => {
        console.log('OficinasAgrupadoras', OficinasAgrupadoras)
        if (OficinasAgrupadoras.length > 0) {
            let Ofi = OficinasAgrupadoras.map(function (Oficina, index, array) {
                return {
                    id: Oficina.id_oficina_agrupa, // acts as primary key, should be unique and non-empty string
                    label: Oficina.oficina_agrupa,
                    value: Oficina.id_oficina_agrupa,
                }
            })

            setOfiCheck(Ofi)
        }
    }, [OficinasAgrupadoras])

    const estadoExpandir = () => {
        return (buscarTurneraFiltro.tramite == '') ? false : true
    }

    const handleModalOficina = () => {
        setStateModalChkOficinas(true)
    }

    const itemTramiteRetraido = (item) => {

        return (
            < ItemAccordion key={item.item.id} Turnera={item.item} estadoExpandir={false} filtro={buscarTurneraFiltro.tramite} ></ItemAccordion >
        )
    }

    const itemTramiteExpandido = (item) => {

        return (
            < ItemAccordion key={item.item.id} Turnera={item.item} estadoExpandir={true} filtro={buscarTurneraFiltro.tramite} ></ItemAccordion >
        )
    }

    return (
        <>
            <View style={[stylesGral.viewCard, stylesGral.elevation, { height: vh * 550 }]}>
                <Input
                    placeholder="Buscá tu trámite"
                    containerStyle={stylesGral.inputForm}
                    value={buscarTurneraTxt}
                    rightIcon={
                        <Icon
                            type="material"
                            name="search"
                            iconStyle={stylesGral.iconoGris}
                        />
                    }
                    leftIcon={
                        <Icon
                            type="material"
                            name="close"
                            onPress={() => (
                                blanquearFiltro()
                            )}
                        />
                    }
                    onChange={(e) => handleBuscaTurnera(e)}
                />
                <Text>Ingresa un minimo de tres caracteres</Text>


                {(!expandir) ?
                    (<>
                        <Text>Lista R</Text>
                        <FlatList
                            style={{ height: vh * 300 }}
                            data={Turneras}
                            renderItem={itemTramiteRetraido}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={true}
                            ListEmptyComponent={<Text>...Buscando Trámites R...</Text>}
                        /></>)
                    :
                    (<>
                        <Text>Lista L</Text>
                        <FlatList
                            style={{ height: vh * 300 }}
                            data={Turneras}
                            renderItem={itemTramiteExpandido}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={true}
                            ListEmptyComponent={<Text>...Buscando Trámites E...</Text>}
                        /></>)
                }

                <View style={stylesGral.containerBtnMediano}>
                    <TouchableOpacity onPress={() => { handleModalOficina() }} style={stylesGral.btnMediano}>
                        <Text style={stylesGral.textoBtnMediano}>Oficina</Text>

                    </TouchableOpacity>
                </View>
            </View>
            <ModalComp stateModal={stateModalChkOficinas} setModalState={setStateModalChkOficinas} titulo="Filtra por Oficina">
                <Text>Filtro por oficina...</Text>
                <Text>{JSON.stringify(ofiCheck.filter((ofi) => ofi.selected === true))}</Text>
                <RadioGroup
                    radioButtons={ofiCheck}
                    onPress={onPressRadioButton}
                />
            </ModalComp>
        </>
    )
}

const styles = StyleSheet.create({

})