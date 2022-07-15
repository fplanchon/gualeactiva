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
        marginTop: 10,
        fontSize: 12
    },
    tituloH1: {
        fontSize: 25,
    },
    boxSimple: {
        borderWidth: 1,
        borderColor: estilosVar.azulSuave,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    buttonStyleCancelar: {
        backgroundColor: estilosVar.rojoCrayola,
    },
    buttonStyleOutlineCancelar: {
        borderWidth: 2,
        borderColor: estilosVar.rojoCrayola,
    },
    titleStyleCancelar: {
        color: estilosVar.rojoCrayola,
    },
    iconoGris: {
        color: estilosVar.colorIconoInactivo
    }
})

export default stylesGral