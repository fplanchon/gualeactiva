import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native'
import { Card, Input, Icon, Button } from "react-native-elements"
import useAxios from "../../../customhooks/useAxios"
import ItemAccordion from "../../../componentes/modules/turnos/ItemAccordion"
import stylesGral from "../../../utils/StyleSheetGeneral"
import { AuthContext } from "../../../contexts/AuthContext"
import { fechaIso2dmy } from "../../../utils/utilidades"
import { LinearProgress } from 'react-native-elements';
import { PricingCard } from 'react-native-elements';
import estilosVar from "../../../utils/estilos"

const TurnosHome = () => {
    const { authContext, loginState } = React.useContext(AuthContext)
    const [expanded, setExpanded] = useState([])
    const [turnerasData, setTurnerasData] = useState([{}])
    const [buscarTurneraTxt, setBuscarTurneraTxt] = useState({})
    const id_ciudadano = loginState.usuarioInfoFs.id_ciudadano

    const { datos: Turneras, refetch: buscarTurneras } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/buscarTurnosPorTramiteNative',
        data: buscarTurneraTxt
    })


    const { datos: misTurnos, loading: cargandoMisTurnos, refetch: buscarMisTurnos } = useAxios({
        method: 'post',
        url: '/turnosweb/consultas/obtenerMisTurnos',
        data: { id_ciudadano: id_ciudadano }
    })


    const handleBuscaTurnera = (e) => {
        setBuscarTurneraTxt({ tramite: e.nativeEvent.text })
    }

    useEffect(() => {
        console.log('useEffect buscarTurneraTxt')
        buscarTurneras()
    }, [buscarTurneraTxt])

    const proximoTurno = ({ item }) => {
        return (
            <View style={stylesGral.boxSimple}>
                <Text>Trámite: {item.tramite}</Text>
                <Text>Oficina: {item.oficina}</Text>
                <Text>{item.fecha_turno}</Text>

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

                />
            </View>
        )
    }

    return (
        <ScrollView>

            <Card>
                <Card.Title>
                    <Text style={stylesGral.tituloH1}>Proximos Turnos</Text>
                </Card.Title>
                <Card.Divider />
                {cargandoMisTurnos ?
                    <LinearProgress color="primary" />
                    :
                    misTurnos.turnosProximos ?
                        <FlatList
                            data={misTurnos.turnosProximos}
                            renderItem={proximoTurno}
                            keyExtractor={(item) => item.id}
                        />
                        :
                        <Text>Sin Turnos</Text>
                }

            </Card>
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
                        onPress={() => (setBuscarTurneraTxt(''))}
                    />
                }
                onChange={(e) => handleBuscaTurnera(e)}
            />
            {Turneras ? Turneras.map((Turnera, i) => (
                <ItemAccordion Turnera={Turnera} ></ItemAccordion>
            )) : null
            }
        </ScrollView >
    )
}

export default TurnosHome

const styles = StyleSheet.create({
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
})