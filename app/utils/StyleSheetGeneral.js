import { StyleSheet } from "react-native"
import estilosVar from "./estilos"
import { createViewPortConfig } from 'react-native-responsive-view-port'

const { vw, vh } = createViewPortConfig()

const stylesGral = StyleSheet.create({
    vistaPreviaALogin: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: estilosVar.azulSuave,
        height: '100%',
    },
    headerStyle: {
        height: 100,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: estilosVar.azulSuave,

    },
    headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white'
    },
    tabBarStyles: {
        backgroundColor: estilosVar.azulSuave,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
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
        borderWidth: 2,
        borderColor: 'lightgrey',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5,
        minWidth: '90%',
        width: '90%'
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
    viewDobleCentrado: {
        flex: 1,

        justifyContent: 'center',
        //alignContent: 'center',
        alignItems: 'center'
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
    elevation: {
        elevation: 20,
        shadowColor: estilosVar.violetaOscuro,
    },
    textBold: {
        fontWeight: 'bold',
    },
    textCentrado: {
        textAlign: 'center'
    },
    textBoldGris: {
        fontWeight: 'bold',
        color: estilosVar.colorIconoInactivo
    },
    textBoldBlanco: {
        fontWeight: 'bold',
        color: 'white'
    },
    containerBtnGrande: {
        alignItems: 'center',
        height: vh * 100,
        paddingBottom: 10
    },
    btnGrande: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: estilosVar.azulSuave,
        width: '90%',
        height: 100,
        borderRadius: 20
    },
    textoBtnGrande: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30
    },
    iconRow: {
        flexDirection: "row",

        alignItems: "center"
    },
    encabezadoLogo: {
        backgroundColor: estilosVar.azulSuave,
        width: "100%",
        height: 75,
        borderBottomRightRadius: 120,
        borderBottomLeftRadius: 0
    }
})

export default stylesGral