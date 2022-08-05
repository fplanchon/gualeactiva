import React, { useState } from "react"
import { StyleSheet, Text, View, Icon, ScrollView } from 'react-native'
import { ListItem } from "react-native-elements"
import { useNavigation } from "@react-navigation/native";

export default function ItemAccordion(props) {
    const Turnera = props.Turnera
    const [expandido, setExpandido] = useState(false)
    const navigation = useNavigation()
    const irASolicitarTurno = (Tramite) => {
        //console.log('iraSolicitarturno', Tramite)
        navigation.navigate("SolicitarTurno", { 'Tramite': Tramite })
    }

    return (
        <ListItem.Accordion
            content={
                <>
                    <ListItem.Content>
                        <ListItem.Title>{Turnera['oficina_agrupa']}</ListItem.Title>
                    </ListItem.Content>
                </>
            }
            key={Turnera.id_oficina_agrupa}
            isExpanded={expandido}
            onPress={() => {
                setExpandido(!expandido)
            }}
        >
            {Turnera['tramites'].map((Tramite, i) => (
                <ListItem key={Tramite['id_tramite']} bottomDivider onPress={() => { irASolicitarTurno(Tramite) }}>
                    <ListItem.Content >
                        <ListItem.Title >{Tramite['tramite']}</ListItem.Title>
                        <ListItem.Subtitle>Oficina: {Tramite['oficina']}</ListItem.Subtitle>
                        <ListItem.Subtitle>{Tramite['observaciones']}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))}
        </ListItem.Accordion>

    )
}

const styles = StyleSheet.create({})