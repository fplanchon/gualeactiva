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
        fontWeight: 'bold',
    },
    tituloH2: {
        fontSize: 23,
        fontWeight: 'bold',
    },
    tituloH3: {
        fontSize: 21,
        fontWeight: 'bold',
    },
    tituloH4: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    tituloH5: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    tituloH6: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    tituloMargin: {
        marginTop: 15,
        marginBottom: 10
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
    },
    viewCentrado: {
        flex: 1,
        alignItems: "center"
    },
    marginVertical10: {
        marginVertical: 10
    },
    paddigVertical10: {
        paddingVertical: 10
    },
    card: {
        borderRadius: 5
    },
    viewCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '90%',
        marginVertical: 10,
        marginLeft: '5%',
    },
    shadowProp: {
        shadowColor: 'red',//estilosVar.colorIconoInactivo,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    elevation: {
        elevation: 20,
        shadowColor: estilosVar.violetaOscuro,
    },
    textBold: {
        fontWeight: 'bold',
    }

})

export default stylesGral