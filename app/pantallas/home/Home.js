import React, { useState } from "react"
import { View, FlatList, Button, ScrollView, StyleSheet, Dimensions } from "react-native"
import { Image } from "react-native-elements"
import { AuthContext } from "../../contexts/AuthContext"
import { useNavigation } from "@react-navigation/native";
import ButtonHome from "../../componentes/home/ButtonHome"
import stylesGral from "../../utils/StyleSheetGeneral"
import estilosVar from "../../utils/estilos"


export default function Home() {
    const navigation = useNavigation()


    const buttons = [
        { id: 1, icon: "file", title: "Trámites" },
        { id: 2, icon: "calendar", title: "Turnos", onPress: () => navigation.navigate("turnosHome") },
        { id: 3, icon: "file-document", title: "Tasas (boletas)", onPress: () => navigation.navigate("tasasHome") },
        { id: 4, icon: "ticket", title: "Multas" },
        { id: 5, icon: "code-brackets", title: "Pruebas", onPress: () => navigation.navigate("Sandbox") },

    ]

    const WIDTH = Dimensions.get("window").width;
    const column = 2
    const buttonWidth = WIDTH / column;

    return (
        <ScrollView stickyHeaderIndices={[0]}>

            <View style={styles.encabezadoLogo}>
                <Image style={{ width: "100%", height: 75, marginTop: 0 }} resizeMode="contain" source={require("../../../assets/logo-gualeactiva.png")} />
            </View>
            <View style={styles.viewStyle}>
                <FlatList
                    data={buttons}
                    renderItem={({ item }) => {
                        return <ButtonHome key={item.id} widthBtn={buttonWidth} icon={item.icon} title={item.title} onPress={item.onPress} />
                    }}
                    keyExtractor={(item) => item.id}
                    numColumns={column}
                />
            </View>

        </ScrollView>

    )

}

const styles = StyleSheet.create({
    viewStyle: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: 'flex-start',
        height: Dimensions.get("window").height
    },
    encabezadoLogo: {
        backgroundColor: estilosVar.azulSuave,
        width: "100%",
        height: 75,
        borderBottomRightRadius: 120,
        borderBottomLeftRadius: 0
    }
})