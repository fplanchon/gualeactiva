import React from "react"
import { StyleSheet, Text, ScrollView, Image } from "react-native";
import { Input, Icon, Button, Card } from "react-native-elements"
import { AuthContext } from "../../contexts/AuthContext"
import estilosvar from "../../utils/estilos";
import stylesGral from "../../utils/StyleSheetGeneral";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPass, setShowPass] = React.useState(false);
    const { authContext, loginState } = React.useContext(AuthContext);
    const navigation = useNavigation();

    const handleEmail = (e) => {
        setEmail(e.nativeEvent.text)
    }

    const handlePass = (e) => {
        setPassword(e.nativeEvent.text)
    }

    return (
        <ScrollView>

            <Card >
                <Card.Title>
                    <Text style={styles.tituloCard}>
                        Indique Email y Contraseña
                    </Text>
                </Card.Title>
                <Card.Image
                    style={styles.logo}
                    source={require('../../../assets/logo-color.png')}
                />
                <Card.Divider />
                <Input
                    placeholder="Email"
                    containerStyle={styles.inputForm}
                    rightIcon={
                        <Icon
                            type="material"
                            name="email"
                            iconStyle={styles.iconRight}
                        />
                    }

                    onChange={(e) => handleEmail(e)}
                />
                <Input
                    placeholder="Contraseña"
                    containerStyle={styles.inputForm}
                    password={true}
                    secureTextEntry={(showPass) ? false : true}
                    rightIcon={
                        <Icon
                            type="material"
                            name={showPass ? "visibility-off" : "visibility"}
                            iconStyle={styles.iconRight}
                            onPress={() => setShowPass(!showPass)}
                        />
                    }
                    onChange={(e) => handlePass(e)}
                />
                {(loginState.isError) ?
                    <Text style={stylesGral.errorText}>{loginState.errorText}</Text>
                    : null
                }
                <Button title="Iniciar Sesión" onPress={() => authContext.signIn({ email, password })} />
                <Card.Divider />
                <Text style={styles.textRegister}>
                    ¿Aún no tienes una cuenta?&nbsp;&nbsp;
                    <Text
                        style={styles.btnRegister}
                        onPress={() => navigation.navigate("registro")}
                    >
                        Registrate
                    </Text>
                </Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%"
    },
    iconRight: {
        color: estilosvar.colorIconoInactivo
    },
    tituloCard: {
        fontSize: 25
    },
    textRegister: {
        textAlign: "center",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10
    },
    btnRegister: {
        color: estilosvar.azulSuave,
        fontWeight: "bold",
    },
    logo: {
        //width: 200,
    }
})
