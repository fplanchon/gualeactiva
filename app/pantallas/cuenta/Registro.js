import React, { useEffect, useContext, useState, useRef } from "react"

import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Icon } from "react-native-elements";
import * as Yup from 'yup'
import { Formik } from 'formik'
import { AuthContext } from "../../contexts/AuthContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import useAxiosNoToken from "../../customhooks/useAxiosNoToken";
import stylesGral from "../../utils/StyleSheetGeneral";
import TextInputFmk from "../../componentes/TextInputFmk";
import SubmitBtnFmk from "../../componentes/SubmitBtnFmk";
import Loading from "../../componentes/Loading";

import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth'

import estilosVar from "../../utils/estilos";
import { cuilValidator, expRegulares } from "../../utils/validaciones";
import { useTraducirFirebaseError } from "../../customhooks/useTraducirFirebaseError";
import { useFirestore } from "../../customhooks/useFirestore";
import constantes from "../../utils/constantes";
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore";

export default function Registro() {
    const [dataPicker, setDataPicker] = useState(false)
    const [datePlaceHolder, setDatePlaceHolder] = useState(null)
    const { authContext } = useContext(AuthContext);

    const [dataRegistro, setDataRegistro] = useState(registroInitialState)
    const [pedir, setPedir] = useState(0)
    const [pedirCiud, setPedirCiud] = useState(0)
    //const [dniAutocompletar, setDniAutocompletar] = useState(null)


    const { state: firebaseError, dispatch: dispatchFirebaseError } = useTraducirFirebaseError()

    const [showPassword1, setShowPassword1] = useState(true)
    const [showPassword2, setShowPassword2] = useState(true)

    const { setDocument, deleteDocument } = useFirestore()
    const { eliminarUsuarioEnAuthYFirestore, setCiudadanoFirestore, setUsuarioFirestore, updateProfileAuth } = useUsrCiudadanoFirestore()

    const colUsuariosInfo = constantes.colecciones.usuariosInfo;

    const Inputs = {
        nombre: useRef(null),
        apellido: useRef(null),
        dni: useRef(null),
        cuitcuil: useRef(null),
        email: useRef(null),
        celular: useRef(null),
        fechaNacimiento: useRef(null),
        pass: useRef(null),
        confirmaPass: useRef(null)
    }

    const registroInitialState = {
        nombre: '',
        apellido: '',
        dni: null,
        cuitcuil: null,
        email: '',
        celular: '',
        fechaNacimiento: '',
        confirmaPass: '',
    }



    const handleDatePicker = () => setDataPicker(!dataPicker)
    const handleConfirm = (e) => {
        let string = JSON.stringify(e);
        string = string.slice(1, 11);
        let fechaSeleccionada = changeFormatDate(string)
        dataRegistro.fechaNacimiento = fechaSeleccionada;

        //setDatePlaceHolder(dataRegistro.fechaNacimiento);
        handleDatePicker()
    }

    const sEsRequerido = 'Es Requerido';

    const registroValidationSchema = Yup.object({
        nombre: Yup.string().trim().min(2, 'Nombre demasiado corto').required(sEsRequerido),
        apellido: Yup.string().trim().required(sEsRequerido),
        dni: Yup.number().typeError('Ingrese solo números').required(sEsRequerido).test("dni_valido", "El DNI no es válido", val => expRegulares.dni.test(val)),
        cuitcuil: Yup.number().typeError('Ingrese solo números').required(sEsRequerido).test("cuil_valido", "El CUIL no es válido", (val) => (val !== undefined) && cuilValidator(val.toString())),
        email: Yup.string().email('Indique un email válido').required(sEsRequerido),
        celular: Yup.number().typeError('Ingrese solo números').required(sEsRequerido).test("celular", 'Ingrese un celular correcto.', (val) => (val !== undefined) && expRegulares.cel.test(val.toString())),
        fechaNacimiento: Yup.date().typeError('').required(sEsRequerido),
        pass: Yup.string().min(6, 'Mínimo 6 caracteres').required(sEsRequerido),
        confirmaPass: Yup.string().oneOf([Yup.ref('pass')], 'No coincide la contraseña')

    })

    const { res, err, loading, refetch } = useAxiosNoToken({
        method: 'post',
        url: '/registrarCiudadano',
        data: dataRegistro
    })



    const crearUsuarioEnAuthYFirestore = () => {

    }

    useEffect(() => {
        //console.log('useEffect pedir')
        if (pedir > 0) {

            const registrar = async () => {
                // console.log('registrar()')
                const auth = getAuth();
                dispatchFirebaseError(false);
                await createUserWithEmailAndPassword(auth, dataRegistro.email, dataRegistro.pass)
                    .then((userCredential) => {
                        //console.log('refetch()')
                        refetch()
                    })
                    .catch((error) => {

                        /*deleteUser(getAuth().currentUser).then(() => {
 
                        }).catch((error) => {
                            console.log('error borrarUsuario', error);
                        });*/
                        dispatchFirebaseError({ type: error.code })
                        // useTraducirFirebaseError(error)
                    });
            }

            registrar()
        }
    }, [pedir])

    useEffect(() => {
        //console.log('useEffect res')
        const effectRes = async () => {
            //console.log(res)
            let flagError = false;
            if (typeof res.data !== 'undefined') {
                if (res.data.success) {
                    //console.log('registro', res.data.data.registro)
                    if (res.data.data.registro === 'OK') {
                        try {
                            let sId_ciudadano = res.data.data.id_ciudadano.toString()
                            const auth = getAuth();
                            const dataCiudadano = {
                                'id_ciudadano': sId_ciudadano,
                                'email': dataRegistro.email,
                                'nombres': dataRegistro.apellido + ' ' + dataRegistro.nombre,
                                'cuitcuil': dataRegistro.cuitcuil
                            }

                            await updateProfileAuth(dataRegistro.apellido + ' ' + dataRegistro.nombre)

                            await setUsuarioFirestore(res.data.data.id_ciudadano)

                            await setCiudadanoFirestore(dataCiudadano)

                            const loginPayload = {
                                email: dataRegistro.email,
                                token: auth.currentUser.stsTokenManager.accessToken,
                                usuarioInfo: dataCiudadano
                            }

                            authContext.dispatchManual('LOGIN', loginPayload)
                        } catch (error) {
                            console.log('Error Registro effectRes', error)

                        }
                    } else {
                        flagError = true
                    }
                } else {
                    flagError = true
                }
            }

            if (flagError) {
                eliminarUsuarioEnAuthYFirestore()
            }

        }

        effectRes()
    }, [res])

    const handleEditDni = async (values) => {
        //values.nombre = 'asasas'
        try {
            const CiudParaAutocompletar = await axios.post(constantes.API + 'buscarCiudParaAutocompletar', { dni: values.dni })
            //console.log('CiudParaAutocompletar', CiudParaAutocompletar.data)
            if (CiudParaAutocompletar.data.data !== null) {
                let AutoCiud = CiudParaAutocompletar.data.data
                values.nombre = AutoCiud['nombre']
                values.apellido = AutoCiud['apellido']
                values.cuitcuil = AutoCiud['cuitcuil']
                values.celular = AutoCiud['telefono']
                values.fechaNacimiento = AutoCiud['fecha_nacimiento']
                values.email = AutoCiud['email_activa']
                Inputs.cuitcuil.current.focus()
                Inputs.cuitcuil.current.focus()
                //doble para que impacte el autocompletado
            }
        } catch (error) {
            console.log('err', error)
        }
    }


    const submitRegistro = (values, formikActions) => {
        //console.log('submitRegistro')
        setDataRegistro(values)
        setPedir(pedir + 1)
        formikActions.setSubmitting(false)
    }

    return (
        <ScrollView style={stylesGral.formContainer}  >
            <Text h4 style={styles.titulo} >Registrate en GualeActiva</Text>
            <Formik
                initialValues={registroInitialState}
                validationSchema={registroValidationSchema}
                onSubmit={submitRegistro}
            >
                {({ values, isSubmitting, errors, touched, isValid, handleBlur, handleChange, handleSubmit }) => (
                    <>
                        <TextInputFmk
                            name="dni"
                            placeholder="Número de documento"
                            slabel="Número de documento"
                            error={touched.dni && errors.dni}
                            onChangeText={handleChange('dni')}
                            onBlur={handleBlur('dni')}
                            value={values.dni}
                            keyboardType='number-pad'
                            ref={Inputs.dni}
                            onSubmitEditing={() => { handleEditDni(values) }} blurOnSubmit={false}
                        />
                        <TextInputFmk
                            name="cuitcuil"
                            placeholder="Cuit/Cuil"
                            slabel="Cuit/Cuil"
                            error={touched.cuitcuil && errors.cuitcuil}
                            onChangeText={handleChange('cuitcuil')}
                            onBlur={handleBlur('cuitcuil')}
                            value={values.cuitcuil}
                            keyboardType='number-pad'
                            ref={Inputs.cuitcuil}
                            onSubmitEditing={() => { Inputs.email.current.focus(); }} blurOnSubmit={false}
                        />
                        <TextInputFmk
                            name="nombre"
                            placeholder="Nombre"
                            slabel="Nombre"
                            error={touched.nombre && errors.nombre}
                            onChangeText={handleChange('nombre')}
                            onBlur={handleBlur('nombre')}
                            value={values.nombre}
                            ref={Inputs.nombre}
                            onSubmitEditing={() => { Inputs.apellido.current.focus(); }} blurOnSubmit={false}
                        />
                        <TextInputFmk
                            name="apellido"
                            placeholder="Apellido"
                            slabel="Apellido"
                            error={touched.apellido && errors.apellido}
                            onChangeText={handleChange('apellido')}
                            onBlur={handleBlur('apellido')}
                            value={values.apellido}
                            ref={Inputs.apellido}
                            onSubmitEditing={() => { Inputs.dni.current.focus(); }} blurOnSubmit={false}
                        />

                        <TextInputFmk
                            name="email"
                            placeholder="Email"
                            slabel="Email"
                            error={touched.email && errors.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            ref={Inputs.email}
                            onSubmitEditing={() => { Inputs.celular.current.focus(); }} blurOnSubmit={false}
                        />
                        <TextInputFmk
                            name="celular"
                            placeholder="Celular"
                            slabel="Celular"
                            error={touched.celular && errors.celular}
                            onChangeText={handleChange('celular')}
                            onBlur={handleBlur('celular')}
                            value={parseInt(values.celular[0]) === 0 ? values.celular.slice(1) : values.celular}
                            keyboardType='number-pad'
                            ref={Inputs.celular}
                            onSubmitEditing={() => { Inputs.fechaNacimiento.current.focus(); }} blurOnSubmit={false}
                        />
                        <View style={stylesGral.info}>
                            <View style={styles.iconRow}>
                                <Icon style={styles.styleIcon} name='information' type='material-community' color={estilosVar.naranjaBitter} />
                                <Text style={styles.textInfo}>Código de área sin "0" + Teléfono sin "15"</Text>
                            </View>
                        </View>
                        <TextInputFmk
                            name="fechaNacimiento"
                            placeholder={datePlaceHolder ? datePlaceHolder : "Fecha Nacimiento"}
                            slabel="Fecha Nacimiento"
                            error={touched.fechaNacimiento && errors.fechaNacimiento}
                            onChangeText={handleChange('fechaNacimiento')}
                            onBlur={handleBlur('fechaNacimiento')}
                            value={values.fechaNacimiento}
                            rightIcon={
                                <Icon
                                    type="material-community"
                                    name={values.fechaNacimiento ? "calendar-check" : "calendar-blank"}
                                    color={values.fechaNacimiento ? estilosVar.colorIconoActivo : estilosVar.colorIconoInactivo}
                                    onPress={handleDatePicker}
                                />
                            }
                            ref={Inputs.fechaNacimiento}
                            onSubmitEditing={() => { Inputs.pass.current.focus(); }} blurOnSubmit={false}
                        />
                        {dataPicker &&
                            <DateTimePickerModal
                                isVisible={dataPicker}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={handleDatePicker}
                            />
                        }
                        <TextInputFmk
                            name="pass"
                            placeholder="Contraseña"
                            slabel="Contraseña"
                            error={touched.pass && errors.pass}
                            onChangeText={handleChange('pass')}
                            onBlur={handleBlur('pass')}
                            value={values.pass}
                            secureTextEntry={(showPassword1) ? true : false}
                            rightIcon={
                                <Icon
                                    type="material"
                                    name={showPassword1 ? "visibility-off" : "visibility"}
                                    onPress={() => setShowPassword1(!showPassword1)}
                                />
                            }
                            ref={Inputs.pass}
                            onSubmitEditing={() => { Inputs.confirmaPass.current.focus(); }} blurOnSubmit={false}
                        />
                        <TextInputFmk
                            name="confirmaPass"
                            placeholder="Confirma Contraseña"
                            slabel="Confirma Contraseña"
                            error={touched.confirmaPass && errors.confirmaPass}
                            onChangeText={handleChange('confirmaPass')}
                            onBlur={handleBlur('confirmaPass')}
                            value={values.confirmaPass}
                            secureTextEntry={(showPassword2) ? true : false}
                            rightIcon={
                                <Icon
                                    type="material"
                                    name={showPassword2 ? "visibility-off" : "visibility"}
                                    onPress={() => setShowPassword2(!showPassword2)}
                                />
                            }
                            ref={Inputs.confirmaPass}
                        />

                        <SubmitBtnFmk submitting={isSubmitting} onPress={handleSubmit} title='Registrarme' />
                        {(err) ?
                            <>
                                <Text>Err axios</Text>
                                <Text style={stylesGral.errorText}>{JSON.stringify(err)}</Text>
                            </>
                            : null
                        }
                        {(typeof res.data !== 'undefined') ?
                            (!res.data.success) ?
                                <>
                                    <Text>err res</Text>
                                    <Text style={stylesGral.errorText}>{res.data.error}</Text>
                                </>
                                : null
                            : null
                        }
                        {(firebaseError) ?
                            <>
                                <Text>err firebase</Text>
                                <Text style={stylesGral.errorText}>{JSON.stringify(firebaseError)}</Text>
                            </>
                            : null
                        }
                    </>
                )}
            </Formik>
            <Text>{pedir}</Text>
            {loading ? (
                <Loading isLoading={true} text={"Consultando..."} />
            ) : null}
        </ScrollView>
    )

}

const changeFormatDate = (string) => {
    string = string.replace(/-/g, '/');
    return string = `${string.slice(8, 10)}/${string.slice(5, 7)}/${string.slice(0, 4)}`
}

const styles = StyleSheet.create({
    titulo: {
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 30
    },
    info: {
        width: 295,
        height: 41,
        flexDirection: "row",
    },
    iconRow: {
        height: 41,
        flexDirection: "row",
        flex: 1,
        marginBottom: 10,
        marginTop: -10
    },
    styleIcon: {
        fontSize: 30,
        width: 40,
        height: 41
    },
    textInfo: {
        height: 29,
        width: 265,
    },
})