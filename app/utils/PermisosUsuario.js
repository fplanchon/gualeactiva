import * as ImagePickerExpo from 'expo-image-picker';

class PermisosUsuario {
  obtenerPermisoCamara = async () => { 
    const { status } = await ImagePickerExpo.requestCameraPermissionsAsync();

    if (status !== 'granted' ) {
      alert('Necesitas permisos para usar la cámara');
    }
  }
}

export default new PermisosUsuario();