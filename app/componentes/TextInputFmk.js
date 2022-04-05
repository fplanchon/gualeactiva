//Input custom para usar en formularios con  <FORMIK/>
import React from "react";
import { View } from "react-native";
import { Input, Text } from "react-native-elements";
import stylesGral from "../utils/StyleSheetGeneral";

export default function TextInputFmk(props) {
    const { placeholder, error, slabel } = props
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold' }}>{slabel}</Text>
                {error ? (
                    <Text style={stylesGral.errorText}>{error}</Text>
                ) : null}
            </View>
            <Input {...props} />
        </>
    )
}
