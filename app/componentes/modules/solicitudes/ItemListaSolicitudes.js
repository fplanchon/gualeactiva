import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import stylesGral from '../../../utils/StyleSheetGeneral';
import estilosVar from '../../../utils/estilos';
import { ListItem, Icon, Badge, Divider } from 'react-native-elements'
import { createViewPortConfig } from 'react-native-responsive-view-port';
import useAxios from "../../../customhooks/useAxios"
import { AuthContext } from "../../../contexts/AuthContext"
import { fechaIso2dmy } from '../../../utils/utilidades';
import { useNavigation } from "@react-navigation/native";
import * as RootNavigation from '../../../navigations/RootNavigation';


export default function ItemListaSolicitudes(props) {
    const { vw, vh } = createViewPortConfig();

    const Solicitud = props.item
    //const navigation = useNavigation();

    const handleClickItem = (id_ticket) => {
        RootNavigation.navigate('solicitud', { id_ticket: id_ticket })
        //navigation.navigate("solicitud", { id_ticket: id_ticket })
    }

    return (
        <>
            <TouchableOpacity onPress={() => { handleClickItem(Solicitud.id_ticket) }} >
                <View style={styles.itemLista} >
                    <View style={styles.tituloYBadge}>
                        <Text style={{ maxWidth: 225 * vh }}>{Solicitud.problematica}</Text>
                        <Text style={{ maxWidth: 225 * vh }}>hace {Solicitud.hacecuanto}</Text>
                    </View>
                    <Text>{Solicitud.tipo_solicitud}</Text>
                </View>
            </TouchableOpacity>
            <Divider style={styles.divider} orientation="horizontal" />
        </>

    )
}

//export default ItemListaSolicitudes

const styles = StyleSheet.create({
    itemLista: { paddingVertical: 10, paddingHorizontal: 5 },
    tituloYBadge: { flex: 1, justifyContent: 'space-between', flexDirection: 'row' },
    divider: { marginTop: 0 }
})