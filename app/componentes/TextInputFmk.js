//Input custom para usar en formularios con  <FORMIK/>
import React, { forwardRef, useRef } from 'react';
import { View } from "react-native";
import { Input, Text } from "react-native-elements";
import stylesGral from "../utils/StyleSheetGeneral";

const TextInputFmk = (props, ref) => {
    const { placeholder, error, slabel } = props
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {slabel && <Text style={{ fontWeight: 'bold' }}>{slabel}</Text>}
                {error ? (
                    <Text style={stylesGral.errorText}>{error}</Text>
                ) : null}
            </View>
            <Input {...props} ref={ref}/>
        </>
    )
}

export default forwardRef(TextInputFmk);