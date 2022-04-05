import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import stylesGral from "../utils/StyleSheetGeneral";
import estilosVar from "../utils/estilos";

export default function SubmitBtnFmk({ title, onPress, submitting }) {
    const backgroundColor = !submitting ? estilosVar.azulSuave : estilosVar.colorIconoInactivo

    return (
        <TouchableOpacity style={[stylesGral.touchableSubmitBtn, { backgroundColor }]} onPress={!submitting ? onPress : null}>
            <Text style={stylesGral.textSubminBtn}>{title}</Text>
        </TouchableOpacity>
    )
}
