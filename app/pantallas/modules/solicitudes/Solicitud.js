import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { LinearProgress } from 'react-native-elements'
import useAxios from "../../../customhooks/useAxios"
import HistorialSolicitud from '../../../componentes/modules/solicitudes/HistorialSolicitud'

const Solicitud = ({ route }) => {
    const id_ticket = route.params.id_ticket
    const [Historial, setHistorial] = React.useState({})

    const { datos: DetalleTicket, loading: cargandoDetalleTicket, refetch: buscarDetalleTicket, err: errorDetalleTicket } = useAxios({
        method: 'post',
        url: '/rim/consultas/obtenerTicketDetalle',
        data: { id_ticket: id_ticket }
    })

    React.useEffect(() => {
        if (DetalleTicket.Historial) {
            setHistorial(DetalleTicket.Historial)
        }
    }, [DetalleTicket])



    return (
        <View >
            <Text>Solicitud Nº: {route.params.id_ticket}</Text>
            <Text>Parametros: {JSON.stringify(route.params)}</Text>
            {cargandoDetalleTicket ?
                (<LinearProgress color="primary" />)
                : null
            }
            <HistorialSolicitud Historial={Historial} />
        </View>
    )
}

export default Solicitud

const styles = StyleSheet.create({})