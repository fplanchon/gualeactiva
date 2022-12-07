import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import stylesGral from '../../../utils/StyleSheetGeneral';
import estilosVar from '../../../utils/estilos';
import { ListItem, Icon, Badge, Divider } from 'react-native-elements'
import { createViewPortConfig } from 'react-native-responsive-view-port';
import useAxios from "../../../customhooks/useAxios"
import { AuthContext } from "../../../contexts/AuthContext"
import { fechaIso2dmy } from '../../../utils/utilidades';
import ItemListaSolicitudes from './ItemListaSolicitudes';


const MisSolicitudesPendientes = () => {
    const { vw, vh } = createViewPortConfig();
    // const { authContext, loginState } = React.useContext(AuthContext)
    const id_ciudadano = 35741// loginState.usuarioInfoFs.id_ciudadano
    const [listaPendientes, setListaPendientes] = React.useState(false)

    const { datos: misPendientes, loading: cargandoMisPendientes, refetch: buscarMiListadoTickets, err: errorMisPendientes, res: resMisPendientes, } = useAxios({
        method: 'post',
        url: '/rim/consultas/obtenerMiListadoTickets',
        //ejecutarEnInicio: false,
        data: { id_ciudadano: id_ciudadano, 'estado': 'P' }
    })

    const list = [
        {
            title: 'Appointments',
            subtitle: 'av-timer'
        },
        {
            title: 'Trips',
            subtitle: 'flight-takeoff'
        },
        {
            title: 'Loren impu',
            subtitle: 'takeoff-asd'
        },

    ]

    useEffect(() => {
        buscarMiListadoTickets()
    }, [])


    useEffect(() => {
        console.log('misPendientes', misPendientes)
        setListaPendientes(misPendientes.results)
        //console.log('errorMisPendientes', errorMisPendientes)
        // console.log('resMisPendientes', resMisPendientes)
    }, [misPendientes])


    return (
        <>
            <Text style={[stylesGral.tituloH3, stylesGral.textCentrado]}>Solicitudes Pendientes</Text>
            <View >
                {listaPendientes ? (
                    listaPendientes.map((item, i) => (
                        <ItemListaSolicitudes Solicitud={item}></ItemListaSolicitudes>
                    ))
                ) : (
                    <Text>...</Text>
                )
                }
            </View>
        </>
    )
}

export default MisSolicitudesPendientes

const styles = StyleSheet.create({
    itemLista: { paddingVertical: 10, paddingHorizontal: 5 },
    tituloYBadge: { flex: 1, justifyContent: 'space-between', flexDirection: 'row' },
    divider: { marginTop: 0 }
})