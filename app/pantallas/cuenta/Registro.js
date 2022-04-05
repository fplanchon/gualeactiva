import React, { useEffect, useContext, useState } from "react"
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import useAxiosNoToken from "../../customhooks/useAxiosNoToken";
import * as Yup from 'yup'
import { Formik } from 'formik'
import stylesGral from "../../utils/StyleSheetGeneral";
import TextInputFmk from "../../componentes/TextInputFmk";
import SubmitBtnFmk from "../../componentes/SubmitBtnFmk";
import Loading from "../../componentes/Loading";
import axiosInstance from "../../utils/axiosInstance";
import { Button } from "react-native-elements/dist/buttons/Button";
import { AuthContext } from "../../contexts/AuthContext";

export default function Registro() {
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

    const { authContext } = useContext(AuthContext);

    const [dataRegistro, setDataRegistro] = useState(registroInitialState)
    const [pedir, setPedir] = useState(0)

    const sEsRequerido = 'Es Requerido';

    const registroValidationSchema = Yup.object({
        nombre: Yup.string().trim().min(2, 'Nombre demaciado corto').required(sEsRequerido),
        apellido: Yup.string().trim().required(sEsRequerido),
        dni: Yup.number('Ingrese solo números').min(1000000, 'Se aceptan 7 u 8 caracteres').max(99999999, 'Se aceptan 7 u 8 caracteres').required(sEsRequerido),
        cuitcuil: Yup.number('Ingrese solo números').integer('Ingrese solo númerox').required(sEsRequerido),
        email: Yup.string().email('Indique un email válido').required(sEsRequerido),
        celular: Yup.number('Ingrese solo números').min(1000000000, 'Al menos 10 caracteres').required(sEsRequerido),
        fechaNacimiento: Yup.date('Formato de fecha (DD/MM/YYY)').required(sEsRequerido),
        pass: Yup.string().min(6, 'Mínimo 6 caracteres').required(sEsRequerido),
        confirmaPass: Yup.string().oneOf([Yup.ref('pass')], 'No coincide con la contraseña')

    })

    const { res, err, loading, refetch } = useAxiosNoToken({
        method: 'post',
        url: '/registrarCiudadano',
        data: dataRegistro
    })

    useEffect(() => {
        if (pedir > 0) {
            const registrar = () => {
                console.log('dataregistro', dataRegistro)
                refetch()

            }
            registrar()
        }
    }, [pedir])

    useEffect(() => {
        const effectRes = () => {
            if (typeof res.data !== 'undefined') {
                if (res.data.success) {
                    console.log('registro', res.data.data.registro)
                    if (res.data.data.registro === 'OK') {
                        const dni = res.data.data.dni
                        const pass = res.data.data.pass
                        console.log(res.data.data.dni, res.data.data.pass)
                        authContext.signIn({ dni: dni, password: pass })
                    }
                }
            }
        }

        effectRes()
    }, [res])


    const submitRegistro = (values, formikActions) => {
        console.log('submitRegistro');
        //console.log(values)

        setDataRegistro(values)

        //formikActions.resetForm()

        //const respuesta = await axiosInstance.post('registrarCiudadano', values);
        // console.log(respuesta.data.data);
        formikActions.setSubmitting(false);
        setPedir(pedir + 1)
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
                            name="nombre"
                            placeholder="Nombre"
                            slabel="Nombre"
                            error={touched.nombre && errors.nombre}
                            onChangeText={handleChange('nombre')}
                            onBlur={handleBlur('nombre')}
                            value={values.nombre}
                        />
                        <TextInputFmk
                            name="apellido"
                            placeholder="Apellido"
                            slabel="Apellido"
                            error={touched.apellido && errors.apellido}
                            onChangeText={handleChange('apellido')}
                            onBlur={handleBlur('apellido')}
                            value={values.apellido}
                        />
                        <TextInputFmk
                            name="dni"
                            placeholder="Número de documento"
                            slabel="Número de documento"
                            error={touched.dni && errors.dni}
                            onChangeText={handleChange('dni')}
                            onBlur={handleBlur('dni')}
                            value={values.dni}
                            keyboardType='number-pad'
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
                        />
                        <TextInputFmk
                            name="email"
                            placeholder="Email"
                            slabel="Email"
                            error={touched.email && errors.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        <TextInputFmk
                            name="celular"
                            placeholder="Celular"
                            slabel="Celular"
                            error={touched.celular && errors.celular}
                            onChangeText={handleChange('celular')}
                            onBlur={handleBlur('celular')}
                            value={values.celular}
                            keyboardType='number-pad'
                        />
                        <TextInputFmk
                            name="fechaNacimiento"
                            placeholder="Fecha Nacimiento"
                            slabel="Fecha Nacimiento"
                            error={touched.fechaNacimiento && errors.fechaNacimiento}
                            onChangeText={handleChange('fechaNacimiento')}
                            onBlur={handleBlur('fechaNacimiento')}
                            value={values.fechaNacimiento}
                        />
                        <TextInputFmk
                            name="pass"
                            placeholder="Contraseña"
                            slabel="Contraseña"
                            error={touched.pass && errors.pass}
                            onChangeText={handleChange('pass')}
                            onBlur={handleBlur('pass')}
                            value={values.pass}
                        />
                        <TextInputFmk
                            name="confirmaPass"
                            placeholder="Confirma Contraseña"
                            slabel="Confirma Contraseña"
                            error={touched.confirmaPass && errors.confirmaPass}
                            onChangeText={handleChange('confirmaPass')}
                            onBlur={handleBlur('confirmaPass')}
                            value={values.confirmaPass}
                        />

                        <SubmitBtnFmk submitting={isSubmitting} onPress={handleSubmit} title='Registrarme' />
                        {(err) ?
                            <Text style={stylesGral.errorText}>{JSON.stringify(err)}</Text>
                            : null
                        }
                        {(typeof res.data !== 'undefined') ?
                            (!res.data.success) ?
                                <Text style={stylesGral.errorText}>{res.data.error}</Text>
                                : null
                            : null
                        }

                    </>
                )}
            </Formik>
            {loading ? (
                <Loading isLoading={true} text={"Consultando..."} />
            ) : null}
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    titulo: {
        textAlign: 'center',
        marginBottom: 30
    }
})