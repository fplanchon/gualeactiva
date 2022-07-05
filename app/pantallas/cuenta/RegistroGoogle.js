import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState, useContext } from "react";
import { getAuth, PhoneAuthProvider, signInWithCredential,deleteUser } from "firebase/auth";
import { Icon, Button, Input } from "react-native-elements";
import { getApp } from "../../utils/firebase-config";
import TextInputFmk from "../../componentes/TextInputFmk";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Yup from 'yup'
import { Formik } from 'formik'
import moment from 'moment';
import estilosVar from "../../utils/estilos";
import { expRegulares, cuilValidator,dateValidator } from "../../utils/validaciones";
import ModalComp from "../../componentes/ModalComp";
import { AuthContext } from "../../contexts/AuthContext";

const RegistroGoogle = (props) => {
  const { userProvider } = props;
  const auth = getAuth();
  const app = getApp();
  const [stateModal, setStateModal] = useState({
    modalPhone: false,
    modalEmailVerificaton: false
  });
  const [codigo, setCodigo] = useState(null);
  const [dataPicker, setDataPicker] = useState(false)
  const [errorExistInFirebase, setErrorExistInFirebase] = useState({ message: "", errorShow: false });
  const recaptchaVerifier = useRef(null);
  const [idVerificacion, setIdVerificacion] = useState(null)
  const { authContext, loginState } = useContext(AuthContext);
  const navigation = useNavigation()

  const Inputs = {
    dni: useRef(null),
    cuitcuil: useRef(null),
    celular: useRef(null),
    fechaNacimiento: useRef(null),
  };

  const dataUsuario = {
    dni: null,
    cuitcuil: null,
    celular: "",
    fechaNacimiento: "",
  };

  const handleDatePicker = () => setDataPicker(!dataPicker)
  const handleConfirm = (date) => {
    dataUsuario.fechaNacimiento = moment(date.toLocaleDateString('es-AR')).format("DD/MM/YYYY")
    handleDatePicker()
  }

  const sEsRequerido = "Es Requerido";
  const registroValidationSchema = Yup.object({
    dni: Yup.number().typeError("Ingrese solo números").required("Es Requerido").test("dni_valido", "El DNI no es válido", (val) => expRegulares.dni.test(val)),
    cuitcuil: Yup.number().typeError('Ingrese solo números').required(sEsRequerido).test("cuil_valido", "El CUIL no es válido", (val) => (val !== undefined) && cuilValidator(val.toString())),
    celular: Yup.number().typeError("Ingrese solo números").required("Es Requerido").test("celular", "Ingrese un celular correcto.", (val) => (val !== undefined) && expRegulares.cel.test(val.toString())),
    fechaNacimiento: Yup.date().required(sEsRequerido).test("Fecha de nacimiento", 'Tiene que ser anterior a la actual', (val) => dateValidator(val)),
  });

  const codigoVerificacionCelular = async () => {
    const credential = PhoneAuthProvider.credential(idVerificacion, codigo);
    await signInWithCredential(auth, credential).then((res) => {
      if (!res._tokenResponse.isNewUser) {
        deleteUser(userProvider).then((res) => {
          navigation.navigate("Login")
        }) 
      } else {
        // Es un usuario nuevo
        authContext.dispatchManual('LOGIN', { token: auth.currentUser.accessToken })
      }
    });
  };

  const handleSubmitGoogle = async (values) => {
    const arrayDisplayName = userProvider.providerData[0].displayName.split(" ");

    const data = {
      nombre: arrayDisplayName[0],
      apellido: arrayDisplayName[1],
      dni: values.dni,
      cuitcuil: values.cuitcuil,
      email: userProvider.providerData[0].email,
      celular: values.celular,
      fechaNacimiento: values.fechaNacimiento,
    };

    const phoneProvider = new PhoneAuthProvider(auth);
    const verID = await phoneProvider.verifyPhoneNumber("+54" + data.celular, recaptchaVerifier.current);
    setIdVerificacion(verID)
    setStateModal({ modalPhone: true, modalEmailVerificaton: false });
  };
  return (
    <View>
      <Formik
        initialValues={dataUsuario}
        validationSchema={registroValidationSchema}
        onSubmit={handleSubmitGoogle}
      >
        {({ values, isSubmitting, errors, touched, isValid, handleBlur, handleChange, handleSubmit }) => (
          <View>
            <TextInputFmk
              name="dni"
              placeholder="Número de documento"
              slabel="Número de documento"
              onChangeText={handleChange("dni")}
              onBlur={handleBlur("dni")}
              value={values.dni}
              keyboardType="number-pad"
              error={touched.dni && errors.dni}
              ref={Inputs.dni}
              onSubmitEditing={() => {
                Inputs.cuitcuil.current.focus();
              }}
              blurOnSubmit={false}
            />
            <TextInputFmk
              name="cuitcuil"
              placeholder="Cuit/Cuil"
              slabel="Cuit/Cuil"
              onChangeText={handleChange("cuitcuil")}
              onBlur={handleBlur("cuitcuil")}
              value={values.cuitcuil}
              keyboardType="number-pad"
              error={touched.cuitcuil && errors.cuitcuil}
              ref={Inputs.cuitcuil}
              onSubmitEditing={() => {
                Inputs.celular.current.focus();
              }}
              blurOnSubmit={false}
            />
            <TextInputFmk
              name="celular"
              placeholder="Celular"
              slabel="Celular"
              onChangeText={handleChange("celular")}
              onBlur={handleBlur("celular")}
              value={values.celular}
              keyboardType="number-pad"
              error={touched.celular && errors.celular}
              ref={Inputs.celular}
              onSubmitEditing={() => {
                Inputs.fechaNacimiento.current.focus();
              }}
              blurOnSubmit={false}
            />
            <View style={styles.iconRow}>
              <Icon
                style={styles.styleIcon}
                name="information"
                type="material-community"
                color={estilosVar.naranjaBitter}
              />
              <Text style={styles.textInfo}>
                Código de área sin "0" + Teléfono sin "15"
              </Text>
            </View>
            <TextInputFmk
              name="fechaNacimiento"
              placeholder="Fecha Nacimiento"
              slabel="Fecha Nacimiento"
              onChangeText={handleChange("fechaNacimiento")}
              onBlur={handleBlur("fechaNacimiento")}
              value={values.fechaNacimiento}
              error={touched.fechaNacimiento && errors.fechaNacimiento}
              rightIcon={
                <Icon
                  type="material-community"
                  name={
                    values.fechaNacimiento ? "calendar-check" : "calendar-blank"
                  }
                  color={
                    values.fechaNacimiento
                      ? estilosVar.colorIconoActivo
                      : estilosVar.colorIconoInactivo
                  }
                  onPress={handleDatePicker}
                />
              }
              ref={Inputs.fechaNacimiento}
            />
            {dataPicker && (
              <DateTimePickerModal
                isVisible={dataPicker}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={handleDatePicker}
              />
            )}
            <Button onPress={handleSubmit} title="Registrarme" />
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={app.options}
            />
          </View>
        )}
      </Formik>
      {stateModal.modalPhone && (
        <ModalComp
          stateModal={stateModal.modalPhone}
          titulo="Verificar telefono"
        >
          <View style={styles.modal}>
            <Text>Ingrese el codigo recibido</Text>
            <Input
              style={styles.inputFormModal}
              placeholder="Codigo"
              containerStyle={styles.inputForm}
              rightIcon={
                <Icon
                  type="material-community"
                  name="cellphone-message"
                  iconStyle={styles.iconRight}
                />
              }
              onChange={(e) => setCodigo(e.nativeEvent.text)}
            />
            <Button
              title="Verificar codigo"
              onPress={codigoVerificacionCelular}
              style={styles.btnRegister}
            />
            {errorExistInFirebase.errorShow && (
              <Text style={styles.errorExistInFirebaseModal}>
                {errorExistInFirebase.message}
              </Text>
            )}
          </View>
        </ModalComp>
      )}
    </View>
  );
};

export default RegistroGoogle;

const styles = StyleSheet.create({
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
  errorExistInFirebase: {
    marginTop: -10,
    marginLeft: 10,
    marginBottom: 20,
    color: estilosVar.rojoCrayola
  },
  errorExistInFirebaseModal: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 20,
    color: estilosVar.rojoCrayola
  },
  // Modal
  modal: {
    margin: 20
  },
  inputFormModal: {
    width: "100%",
  }
});
