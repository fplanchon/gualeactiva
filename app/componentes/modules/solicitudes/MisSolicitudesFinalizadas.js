import React, { useEffect } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import stylesGral from '../../../utils/StyleSheetGeneral';
import estilosVar from '../../../utils/estilos';
import { ListItem, Icon, Badge, Divider } from 'react-native-elements'
import { createViewPortConfig } from 'react-native-responsive-view-port';
import useAxios from "../../../customhooks/useAxios"
import { AuthContext } from "../../../contexts/AuthContext"
import { fechaIso2dmy } from '../../../utils/utilidades';
import ItemListaSolicitudes from './ItemListaSolicitudes';

const MisSolicitudesFinalizadas = () => {
    const { vw, vh } = createViewPortConfig();

    const { authContext, loginState } = React.useContext(AuthContext)
    const id_ciudadano = loginState.usuarioInfoFs.id_ciudadano
    const [listaFinalizadas, setListaFinalizadas] = React.useState(false)

    const { datos: misFinalizadas, loading: cargandoMisFinalizadas, refetch: buscarMiListadoTickets, err: errorMisFinalizadas, res: resMisFinalizadas, } = useAxios({
        method: 'post',
        url: '/rim/consultas/obtenerMiListadoTickets',
        //ejecutarEnInicio: false,
        data: { id_ciudadano: id_ciudadano, 'estadoDist': 'P' }
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
        console.log('Finalizadas', misFinalizadas)
        setListaFinalizadas(misFinalizadas.results)
        //console.log('errorMisPendientes', errorMisPendientes)
        // console.log('resMisPendientes', resMisPendientes)
    }, [misFinalizadas])


    return (
        <>
            <Text style={[stylesGral.tituloH3, stylesGral.textCentrado]}>Solicitudes Finalizadas</Text>
            <View>
                {/*listaFinalizadas ? (
                    listaFinalizadas.map((item, i) => (
                        <ItemListaSolicitudes Solicitud={item}></ItemListaSolicitudes>
                    ))
                ) : (
                    <Text>...</Text>
                )*/
                }

                {(typeof (listaFinalizadas) !== 'undefined') &&
                    <FlatList
                        style={{ height: vh * 400 }}
                        data={listaFinalizadas}
                        renderItem={ItemListaSolicitudes}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={true}
                        ListEmptyComponent={<Text>...</Text>}
                    />
                }
            </View>
        </>
    )
}

export default MisSolicitudesFinalizadas

const styles = StyleSheet.create({
    itemLista: { paddingVertical: 10, paddingHorizontal: 5 },
    tituloYBadge: { flex: 1, justifyContent: 'space-between', flexDirection: 'row' },
    divider: { marginTop: 0 }
})