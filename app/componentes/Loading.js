import React from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Overlay } from "react-native-elements";
import estilosVar from "../utils/estilos";

export default function Loading(props) {
    const { isVisible, text } = props;

    return (
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor="rgba(0,0,0,0.5)"
            overlayBackgroundColor="transparent"
            overlayStyle={styles.overlay}
        >
            <View styles={styles.view}>
                <ActivityIndicator size="large" color={estilosVar.azulSuave} />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>

    )
}

const styles = StyleSheet.create({
    overlay: {
        height: 100,
        width: 200,
        backgroundColor: "#fff",
        borderColor: estilosVar.azulSuave,
        borderWidth: 2,
        borderRadius: 10,
    },
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        textAlign: "center",
        color: estilosVar.azulSuave,
        //textTransform: "uppercase",
        marginTop: 10
    }
})