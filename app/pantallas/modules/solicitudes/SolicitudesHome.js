import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Tab, TabView } from 'react-native-elements'
import stylesGral from '../../../utils/StyleSheetGeneral'
import estilosVar from '../../../utils/estilos'
import MisSolicitudesPendientes from '../../../componentes/modules/solicitudes/MisSolicitudesPendientes'
import MisSolicitudesFinalizadas from '../../../componentes/modules/solicitudes/MisSolicitudesFinalizadas'
import { createViewPortConfig } from 'react-native-responsive-view-port';
import { useNavigation } from "@react-navigation/native"

const { vw, vh } = createViewPortConfig();


const SolicitudesHome = ({ route }) => {
    const [index, setIndex] = React.useState(0);
    const navigation = useNavigation()

    const handleIniciarSolicitud = () => {
        navigation.navigate("selectortramite")
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

    return (
        <ScrollView >
            <View style={{ backgroundColor: estilosVar.azulSuave }}>
                <Tab value={index} onChange={setIndex} indicatorStyle={{ backgroundColor: 'white' }}>
                    <Tab.Item titleStyle={{ color: 'white' }} title="Pendientes" />
                    <Tab.Item titleStyle={{ color: 'white' }} title="Resueltos" />
                </Tab>
            </View>
            <TabView value={index} onChange={setIndex} >
                <TabView.Item style={{ width: '100%' }}>
                    <View >
                        {/*<MisSolicitudesPendientes />*/}
                    </View>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <View >
                        <MisSolicitudesFinalizadas />

                    </View>
                </TabView.Item>
            </TabView>
            <BotonNuevaSolicitud />

        </ScrollView>
    )
}

export default SolicitudesHome

const styles = StyleSheet.create({})