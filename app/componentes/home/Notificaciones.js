import { StyleSheet, Text, View, FlatList, Platform } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import PermisosUsuario from "../../utils/PermisosUsuario";
import { useUsrCiudadanoFirestore } from "../../customhooks/useUsrCiudadanoFirestore";
import * as Notifications from "expo-notifications";
import constantes from "../../utils/constantes";
import useAxios from "../../customhooks/useAxios";
import { Icon } from "react-native-elements";
import Loading from "../Loading";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
  }),
});

const Notificaciones = ({ route }) => {
  const notificationListener = useRef();
  const responseListener = useRef();
  const { recuperarDatosDeSesion, updateProfileFirestore } = useUsrCiudadanoFirestore();
  const [pedir, setPedir] = useState(0);
  const [notificaciones, setNotificaciones] = useState(null);
  const { id_ciudadano } = route.params ? route.params : false;
  const [tokenDispositivo, setTokenDispositivo] = useState(null)



  const { res, err, loading, refetch } = useAxios({
    method: 'post',
    url: 'notificaciones/consultas/notificacionesActiva',
    data: { pagina: 1, tipo: "pendientes", id_ciudadano: id_ciudadano },
  })


  const { res: resTokenDispositivo, err: errorAnadirTokenDispositivoExpo, refetch: anadirTokenDispositivoExpo } = useAxios({
    method: 'post',
    url: 'notificaciones/consultas/anadirTokenDispositivoExpo',
    data: tokenDispositivo,
  })


  const actualizarTokenDispositivo = (token) => {
    console.log('param id_ciudadano', id_ciudadano)
    setTokenDispositivo({ id_ciudadano: id_ciudadano, token: token })

  }

  useEffect(async () => {
    console.log('useEffect tokenDispositivo')
    anadirTokenDispositivoExpo()
  }, [tokenDispositivo])

  useEffect(async () => {
    const token = await PermisosUsuario.registroNotificacionesPushAsync();
    let token_actuales = [];

    const { usuarioInfo } = await recuperarDatosDeSesion();
    if (!usuarioInfo.expo_tokens || usuarioInfo.length < 1) {
      token_actuales.push(token);
      await updateProfileFirestore({ expo_tokens: token_actuales }, id_ciudadano);
      actualizarTokenDispositivo(token)

    } else {
      token_actuales = usuarioInfo.expo_tokens;
      if (token_actuales.indexOf(token) === -1) {
        token_actuales.push(token);
        await updateProfileFirestore({ expo_tokens: token_actuales }, id_ciudadano);
        actualizarTokenDispositivo(token)

      }
    }

    // Cada vez que se recibe una notificación mientras la aplicación está en primer plano
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification.request.trigger.remoteMessage.data);
      });

    // Cada vez que un usuario toca o interactúa con una notificación (Funciona en segundo plano)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    if (pedir > 0) {
      refetch()
      // console.log('Rta ',res);
      //console.log('Error notificaciones/consultas/notificacionesActiva', err);
    } else {
      setPedir(pedir + 1)
    }

    if (res !== null) {
      setNotificaciones(res.data.data.results)
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [pedir]);

  return (
    <View>
      {loading ? (
        <Loading isVisible={loading} text="Cargando..." />
      ) : (
        <>
          {notificaciones !== null ?
            <FlatList
              data={notificaciones}
              renderItem={({ item }) => {
                return <View style={styles.notificationBox}>
                  <Icon name="bolt" type='font-awesome' />
                  <View style={styles.boxText}>
                    <Text style={styles.text} numberOfLines={2} ellipsizeMode='tail'>{item.titulo}</Text>
                    <Text style={styles.text}>{item.hacecuanto} - {item.tipo}</Text>
                  </View>
                </View>
              }}
              keyExtractor={(item) => item.id}
              numColumns={1}
            /> :
            <Text style={{ ...styles.text, marginTop: 20 }}>No se encuentraron notificaciones.</Text>
          }
        </>
      )}
    </View>
  );
};

export default Notificaciones;

const styles = StyleSheet.create({
  notificationBox: {
    width: "100%",
    height: 100,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  boxText: {
    display: "flex",
    flexDirection: "column"
  },
  text: {
    marginRight: 10,
    marginLeft: 10,
    width: "90%",
  },
});
