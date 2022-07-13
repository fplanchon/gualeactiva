import React,{useEffect,useRef,useState, useContext} from "react"
import { View,Text, StyleSheet,ScrollView, Button, TextInput } from "react-native";
import { Avatar,Icon } from "react-native-elements"
import { useNavigation } from "@react-navigation/native";
import ButtonList from "../../componentes/home/ButtonList"
import estilosVar from "../../utils/estilos";
import axios from 'axios';
import { Formik } from "formik";
import * as Yup from 'yup';
import { getAuth, onAuthStateChanged,updateEmail,sendEmailVerification,updatePassword } from "firebase/auth";
import { cuilValidator,dateValidator, expRegulares } from "../../utils/validaciones";
import stylesGral from "../../utils/StyleSheetGeneral";
import ModalComp from "../../componentes/ModalComp";
import Loading from "../../componentes/Loading";
import { AuthContext } from "../../contexts/AuthContext";
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore";
import PermisosUsuario from "../../utils/PermisosUsuario";
import * as ImagePicker from 'expo-image-picker';
import constantes from "../../utils/constantes";

export default function Perfil() {
    const { authContext } = useContext(AuthContext);
    const auth = getAuth();
    const navigation = useNavigation();
    const {recuperarDatosDeSesion, updateProfileFirestore, uploadImageStorageAndSync, getURIToBlob} = useUsrCiudadanoFirestore();

    const [showPass, setShowPass] = useState({inputContrasena: false, inputRepetirContrasena: false});
    const [loading, setLoading] = useState(false);
    const [verification,setVerification] = useState(null);
    const disabled = false
    
    const [initialValues, setInitialValues] = useState({
        nombres: '',
        apellido: '',       
        dni: null, // no editable
        cuitcuil: null,
        email: '', // no editable
        phone: null,
        fechaNacimiento: '',
        photoUrl: null
    }) 
    const initialValModalContrasena = {nuevaContrasena: "", confirmaContrasena: "" }
    const initialValModalCorreo = { nuevoCorreo: "", dni: null }

    const sEsRequerido = "Es requerido"
    const perfilSchema = Yup.object().shape({
        nombres: Yup.string().trim().min(2, 'Nombre demasiado corto').required(sEsRequerido),
        apellido: Yup.string().trim().required(sEsRequerido),
        cuitcuil: Yup.number().typeError('Ingrese solo números').required(sEsRequerido).test("cuil_valido", "El CUIL no es válido", (val) => (val !== undefined) && cuilValidator(val.toString())),
        fechaNacimiento: Yup.date().required(sEsRequerido).test("Fecha de nacimiento", 'La fecha tiene que ser anterior a la actual', (val) => (val !== undefined) && dateValidator(val)),
        phone: Yup.number().typeError('Ingrese solo números').required("Es Requerido").test("celular", 'Ingrese un celular correcto.', (val) => (val !== undefined) && expRegulares.cel.test(val.toString())),
    })

    const emailSchema = Yup.object().shape({
        dni: Yup.number().typeError('Ingrese solo números').required(sEsRequerido).test("dni_valido", "El DNI no es válido", val => expRegulares.dni.test(val)),
        nuevoCorreo: Yup.string().trim().email("Indique un correo válido").required(sEsRequerido).test('correo_nuevo', 'Debe ser distinto al actual', function (value) {
            return value !== initialValues.email
        }),
    })

    const contrasenaSchema = Yup.object().shape({
        nuevaContrasena: Yup.string().min(6, 'Mínimo 6 caracteres').required(sEsRequerido),
        confirmaContrasena: Yup.string().min(6, "Contraseña demasiado corta").required(sEsRequerido).oneOf([Yup.ref('nuevaContrasena')], 'No coincide la contraseña'),
    })

    const updateEmailUsuario = (values) => {
        setLoading(true)
        const auth = getAuth();
        const usuarioActual = auth.currentUser;
        updateEmail(usuarioActual, values.nuevoCorreo).then(() => {
            sendEmailVerification(usuarioActual).then(async() => {
                const url = constantes.API + 'actualizarEmailCiudadano';
                const datos = { "dni": values.dni, "correoNuevo": values.nuevoCorreo };
                const response = await axios.post(url, datos);
                if(response.data.success){
                    setLoading(false);
                    setVisibleModal({ visible: false, tipo: null });
                }else{
                    console.log('Error', response.data.error)
                }

                // Actualiza tambien en Firestore
                const {usuarioInfo} = await recuperarDatosDeSesion()
                await updateProfileFirestore({ email: values.nuevoCorreo}, usuarioInfo.id_ciudadano);
            });
        }).catch(error => {
            console.error(error)
            authContext.signOut()
        })
    }

    const updateContrasenaUsuario = (val) => {
        setLoading(true)
        const usuarioActual = auth.currentUser;
        updatePassword(usuarioActual, val.nuevaContrasena).then(() => {
            setLoading(false);
            setVisibleModal({ visible: false, tipo: null });
        }).catch(error => {
            console.error(error)
            authContext.signOut()
        })
    }

    const updateDatosPersonales = async (values) => {
        delete values.dni

        const {usuarioInfo} = await recuperarDatosDeSesion()
        await updateProfileFirestore(values, usuarioInfo.id_ciudadano);
    }

    const handlePickAvatar = async () => {
        PermisosUsuario.obtenerPermisoCamara();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1]
        })

        if (!result.cancelled) {
            setInitialValues({ ...initialValues, photoUrl: result.uri })
            const blob = await getURIToBlob(result.uri);
            const {usuarioInfo} = await recuperarDatosDeSesion()
            await uploadImageStorageAndSync(blob, usuarioInfo.id_ciudadano);
        }
    }
    
    const Inputs = {
        nombres: useRef(null),
        apellido: useRef(null),
        cuitcuil: useRef(null),
        phone: useRef(null),
        fechaNacimiento: useRef(null),
    }

    const [visibleModal, setVisibleModal] = useState({
        visible: false, 
        tipo: null
    })

    useEffect(()=> {
        onAuthStateChanged(auth, async(user) => {
            if (user) {
                const {usuarioInfo} = await recuperarDatosDeSesion()
                console.log(usuarioInfo)
                setInitialValues({
                    nombres: usuarioInfo ? usuarioInfo.nombres : "",
                    apellido: usuarioInfo ? usuarioInfo.apellido : "",
                    email: user.email,
                    cuitcuil: usuarioInfo ? usuarioInfo.cuitcuil.split('-').join('') : null,
                    phone: usuarioInfo ? usuarioInfo.phone : null,
                    fechaNacimiento: usuarioInfo ? usuarioInfo.fechaNacimiento : "",
                    photoUrl: user.photoURL
                })
                setVerification(user.emailVerified)
            } 
        });
    },[])

    return (
        <ScrollView>
            <View style={styles.boxPerfil}>
                <Avatar size={80} rounded source={{ uri: initialValues.photoUrl }} containerStyle={{ backgroundColor: '#BDBDBD' }}>
                    <Avatar.Accessory size={24} onPress={handlePickAvatar}/>
                </Avatar>
            </View>
            <View>
                {/* Datos personales */}
                <Formik initialValues={initialValues} enableReinitialize onSubmit={updateDatosPersonales} validationSchema={perfilSchema}>
                    {({ handleChange, handleBlur, handleSubmit, values,touched, errors }) => (
                    <View>
                        <View style={styles.formProfile}>
                            <Text style={styles.titulo}>Datos personales</Text>
                            <View style={styles.inputFormProfile}>
                                <Icon name="account" type='material-community' size={20} color="#000"/>
                                <TextInput
                                    onChangeText={handleChange('nombres')}
                                    onBlur={handleBlur('nombres')}
                                    value={values.nombres}
                                    style={{marginLeft: 10,width: "92%"}}
                                    placeholder="Nombre"
                                    ref={Inputs.nombres}
                                    onSubmitEditing={() => { Inputs.apellido.current.focus() }} blurOnSubmit={false}
                                />
                            </View>
                            {errors.nombre && <ErrorMessage error={touched.nombre && errors.nombre}/>   }
                            <View style={styles.inputFormProfile}>
                                <Icon name="account" type='material-community' size={20} color="#000"/>
                                <TextInput
                                    onChangeText={handleChange('apellido')}
                                    onBlur={handleBlur('apellido')}
                                    value={values.apellido}
                                    style={{marginLeft: 10,width: "92%"}}
                                    placeholder="Apellido"
                                    ref={Inputs.apellido}
                                    onSubmitEditing={() => { Inputs.cuitcuil.current.focus(); }} blurOnSubmit={false}
                                />
                            </View>
                            {errors.apellido && <ErrorMessage error={touched.apellido && errors.apellido}/>  }
                            <View style={{...styles.inputFormProfile, backgroundColor: !disabled  && "rgba(135, 134, 134, 0.3)"}}>
                                <Icon name="card-account-details" type='material-community' size={20} color="#000"/>
                                <TextInput
                                    onChangeText={handleChange('dni')}
                                    onBlur={handleBlur('dni')}
                                    value={values.dni}
                                    style={{marginLeft: 10, width: "92%", color: "#000"}}
                                    placeholder="DNI"
                                    editable={disabled} selectTextOnFocus={false}
                                />
                            </View>
                            <View style={styles.inputFormProfile}>
                                <Icon name="card-account-details" type='material-community' size={20} color="#000"/>
                                <TextInput
                                    onChangeText={handleChange('cuitcuil')}
                                    onBlur={handleBlur('cuitcuil')}
                                    value={values.cuitcuil}
                                    style={{marginLeft: 10,width: "92%"}}
                                    placeholder="CUIT / CUIL"
                                    keyboardType='number-pad'
                                    ref={Inputs.cuitcuil}
                                    onSubmitEditing={() => { Inputs.fechaNacimiento.current.focus(); }} blurOnSubmit={false}
                                />
                            </View>
                            {errors.cuitcuil && <ErrorMessage error={touched.cuitcuil && errors.cuitcuil}/>}
                            <View style={{...styles.inputFormProfile, backgroundColor: !disabled  && "rgba(135, 134, 134, 0.3)"}}>
                                <Icon name="at" type='material-community' size={20} color="#000"/>
                                <TextInput
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    style={{marginLeft: 10,width: "92%", color: "#000"}}
                                    placeholder="Correo"
                                    editable={disabled} selectTextOnFocus={false}
                                />
                            </View>
                            <View style={styles.boxWithIcon}>
                                {verification || initialValues.email.includes("gualeguaychu.gov.ar") ?
                                    <Icon name='check-bold' type='material-community' color={estilosVar.verdeCyan} style={{marginRight: 5}}/>
                                    :
                                    <Icon name='alert-circle' type='material-community' color={estilosVar.rojoCrayola} style={{marginRight: 5}}/>
                                }
                                <Text>{verification || initialValues.email.includes("gualeguaychu.gov.ar") ? "Correo verificado" : "Tienes que verificar el correo"}</Text>
                            </View>
                            <View style={styles.inputFormProfile}>
                                <Icon name="calendar" type='material-community' size={20} color="#000"/>
                                <TextInput
                                    onChangeText={handleChange('fechaNacimiento')}
                                    onBlur={handleBlur('fechaNacimiento')}
                                    value={values.fechaNacimiento}
                                    style={{marginLeft: 10,width: "92%"}}
                                    placeholder="Fecha Nacimiento"
                                    ref={Inputs.fechaNacimiento}
                                    onSubmitEditing={() => { Inputs.phone.current.focus(); }} blurOnSubmit={false}
                                />
                            </View>
                            {errors.fechaNacimiento && <ErrorMessage error={touched.fechaNacimiento && errors.fechaNacimiento}/>   }
                            <View style={styles.inputFormProfile}>
                                <Icon name="cellphone" type='material-community' size={20} color="#000"/>
                                <TextInput 
                                    onChangeText={handleChange('phone')} 
                                    onBlur={handleBlur('phone')} 
                                    value={values.phone && values.phone !== null && parseInt(values.phone[0]) === 0 ? values.phone.slice(1) : values.phone} 
                                    style={{marginLeft: 10,width: "92%"}} 
                                    placeholder="Celular"
                                    ref={Inputs.phone}
                                />
                            </View>
                            {errors.phone && <ErrorMessage error={touched.phone && errors.phone}/>   }
                        </View>
                        <View style={{marginBottom: 10, marginTop: -10}}>
                            <ButtonList title="Guardar cambios" color={estilosVar.colorIconoActivo} onPress={handleSubmit}/>
                        </View>
                    </View>
                    )}
                </Formik>
            </View>
            <View>
                {!initialValues.email.includes("gmail.com") && <ButtonList icon="at" typeIcon="material-community" title="Cambiar correo" onPress={ () => setVisibleModal({visible: true, tipo: "correo electrónico"}) }/>}
                <ButtonList icon="lock" title="Cambiar contraseña" typeIcon="material-community" onPress={ () => setVisibleModal({visible: true, tipo: "contraseña"}) }/>
                <ButtonList icon="bell-slash" typeIcon="font-awesome" title="Notificaciones" onPress={ () => navigation.navigate("ajustesnotificaciones") }/>
                <ButtonList title="Cerrar sesión" color={estilosVar.rojoCrayola} onPress={() => authContext.signOut()}/>
            </View>
            { visibleModal.visible && 
                <ModalComp stateModal={visibleModal.visible} setModalState={setVisibleModal} titulo={`Cambiar ${visibleModal.tipo}`}>
                    <View style={{padding: 20}}>
                        {visibleModal.tipo === "correo electrónico" ? 
                            <>
                                {/* Correo */}
                                <View style={{...styles.boxWithIcon, marginRight: 10, marginLeft: 10, marginBottom: 20}}>
                                    <Icon name='alert-circle' type='material-community' color={estilosVar.rojoCrayola} style={{marginRight: 5}}/>
                                    <Text style={{marginBottom: 20, fontWeight: "900", marginTop: 10}}>Le llegará un correo a la direccion de correo nueva que vaya a ingresar.</Text>
                                </View>
                                <Formik initialValues={initialValModalCorreo} validationSchema={emailSchema} onSubmit={updateEmailUsuario}>
                                    {({ handleChange, handleBlur, handleSubmit, values, errors,touched }) => (
                                    <View>
                                        <View style={styles.inputFormProfile}>
                                            <Icon name="card-account-details" type='material-community' size={20} color="#000"/>
                                            <TextInput 
                                                onChangeText={handleChange('dni')} 
                                                onBlur={handleBlur('dni')} 
                                                value={values.dni} 
                                                style={{marginLeft: 10,width: "92%"}}
                                                placeholder="DNI"
                                            />
                                        </View>
                                        {errors.dni && <ErrorMessage error={touched.dni && errors.dni}/>}
                                        <View style={styles.inputFormProfile}>
                                            <Icon name="email" type='material-community' size={20} color="#000"/>
                                            <TextInput 
                                                onChangeText={handleChange('nuevoCorreo')} 
                                                onBlur={handleBlur('nuevoCorreo')} 
                                                value={values.nuevoCorreo} 
                                                style={{marginLeft: 10,width: "92%"}}
                                                placeholder="Nuevo correo"
                                            />
                                        </View>
                                        {errors.nuevoCorreo && <ErrorMessage error={touched.nuevoCorreo && errors.nuevoCorreo}/>}
                                        <Button onPress={handleSubmit} title="Cambiar correo" />
                                    </View>
                                    )}
                                </Formik>
                            </>
                        : 
                            <>
                                {/* Contraseña */}
                                <Text style={{marginBottom: 20}}>Su nueva contraseña debe ser diferente de las contraseñas utilizadas anteriormente.</Text>
                                <Formik initialValues={initialValModalContrasena} validationSchema={contrasenaSchema} onSubmit={updateContrasenaUsuario}>
                                    {({ handleChange, handleBlur, handleSubmit, values, errors,touched }) => (
                                    <View>
                                        <View style={styles.inputFormProfile}>
                                            <Icon name="form-textbox-password" type='material-community' size={20} color="#000"/>
                                            <TextInput 
                                                onChangeText={handleChange('nuevaContrasena')} 
                                                onBlur={handleBlur('nuevaContrasena')} 
                                                value={values.nuevaContrasena} 
                                                style={{marginLeft: 10,width: "92%"}}
                                                placeholder="Nueva contraseña"
                                                password={true}
                                                secureTextEntry={showPass.inputContrasena ? false : true}
                                            />
                                            <Icon type="material" name={showPass.inputContrasena ? "visibility-off" : "visibility"} iconStyle={styles.iconRight} onPress={() => setShowPass({inputContrasena: !showPass.inputContrasena, ...showPass.inputRepetirContrasena})} />
                                        </View>
                                        {errors.nuevaContrasena && <ErrorMessage error={touched.nuevaContrasena && errors.nuevaContrasena}/>  }
                                        <View style={styles.inputFormProfile}>
                                            <Icon name="form-textbox-password" type='material-community' size={20} color="#000"/>
                                            <TextInput 
                                                onChangeText={handleChange('confirmaContrasena')} 
                                                onBlur={handleBlur('confirmaContrasena')} 
                                                value={values.confirmaContrasena} 
                                                style={{marginLeft: 10,width: "92%"}}
                                                placeholder="Confirma contraseña"
                                                password={true}
                                                secureTextEntry={showPass.inputRepetirContrasena ? false : true}
                                            />
                                            <Icon type="material" name={showPass.inputRepetirContrasena ? "visibility-off" : "visibility"} iconStyle={styles.iconRight} onPress={() => setShowPass({...showPass.inputContrasena, inputRepetirContrasena: !showPass.inputRepetirContrasena})} />
                                        </View>
                                        {errors.confirmaContrasena && <ErrorMessage error={touched.confirmaContrasena && errors.confirmaContrasena}/>  }
                                        <Button onPress={handleSubmit} title="Cambiar contraseña" />
                                    </View>
                                    )}
                                </Formik>
                            </>
                        }
                    </View>
                </ModalComp>
            }
            {loading && <Loading isLoading={true} text={"Cargando..."} />}
        </ScrollView>
    )
}

const ErrorMessage = (props) => {
    return (
        <View style={{...styles.boxWithIcon, marginRight: 10, marginLeft: 10, marginBottom: 20}}>
            <Text style={stylesGral.errorText}>{props.error}</Text>
        </View>
    )
}

const styles =  StyleSheet.create({
    boxPerfil:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        marginTop: 10
    },
    textPerfil: {
        fontSize: 16,
        marginTop: 5
    },
    boxAvatar: {
        borderRadius: 9,
        backgroundColor: '#3F4257'
    },
    formProfile: {
        padding: 10
    },
    titulo: {
        marginTop: 20,
        marginLeft: 5,
        marginBottom: 10,
        fontSize: 16
    },
    inputFormProfile: {
        height: 60,
        backgroundColor: "rgba(230, 230, 230, 0.3)",
        display: "flex",
        flexDirection: "row",
        justifyContent:"flex-start",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 50,
        borderRadius: 10,
        marginBottom: 8
    },
    boxWithIcon: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 5
    },
    iconRight: {
        color: estilosVar.colorIconoInactivo,
    },
})