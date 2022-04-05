import { StyleSheet } from "react-native";
import estilosVar from "./estilos";

const stylesGral = StyleSheet.create({
    formContainer: {
        paddingLeft: 30,
        paddingRight: 30,
        //backgroundColor: estilosVar.beige
        paddingBottom: 10,
    },
    touchableSubmitBtn: {
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textSubminBtn: {
        fontSize: 18,
        color: '#fff',
    },
    errorText: {
        color: estilosVar.rojoCrayola,
        marginTop: 10
    }
})

export default stylesGral