import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import stylesGral from "../utils/StyleSheetGeneral";
import estilosVar from "../utils/estilos";

export default function SubmitBtnFmk({ title, onPress, submitting,disable,errorFir }) {
    const backgroundColor = (disable && !errorFir.errorShow) ? estilosVar.azulSuave : estilosVar.colorIconoInactivo

    return (
        <TouchableOpacity style={[stylesGral.touchableSubmitBtn, { backgroundColor },{"marginBottom": 30}]} onPress={!submitting ? onPress : null} disabled={!disable ? true : false }>
            <Text style={stylesGral.textSubminBtn}>{title}</Text>
        </TouchableOpacity>
    )
}
