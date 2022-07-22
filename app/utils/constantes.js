'use strict'
import * as Device from 'expo-device';

const constantes = {
    // API: 'http://fp-apiseg.gchu.org/',
    //API: 'https://desarrollo.gualeguaychu.gov.ar/',
    //API: Device.isDevice ? 'https://apiseg-dev.gualeguaychu.gov.ar/' : 'http://pp-apiseg.gchu.org/',
    API: 'https://apiseg-dev.gualeguaychu.gov.ar/',
    expoClientIdGoogle: '265790572597-3unv3sjbqur7ja48554cph1r26d9nh7s.apps.googleusercontent.com',
    colecciones: {
        usuariosInfo: 'usuariosInfo',
        ciudadanos: 'ciudadanos'
    },
    urls: {
        loginAfip: 'https://desarrollo.gualeguaychu.gov.ar/loginnativeafip',
        loginAnses: 'https://activa.gualeguaychu.gov.ar/loginnativeanses'
    }
}

export default constantes