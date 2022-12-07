import * as ImagePickerExpo from 'expo-image-picker';
import * as Notifications from 'expo-notifications';

class PermisosUsuario {
  obtenerPermisoCamara = async () => {
    const { status } = await ImagePickerExpo.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Necesitas permisos para usar la cámara');
    }
  }
  registroNotificacionesPushAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falló al obtener el token para enviar notificaciones!');
      return;
    }
    console.log('aca getExpoPushTokenAsync')
    token = (await Notifications.getExpoPushTokenAsync({ experienceId: '@fabiandavidp/gualeactiva' })).data;
    console.log('getExpoPushTokenAsync ', token)
    return token;
  }
}

export default new PermisosUsuario();