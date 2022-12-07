import { URL } from 'react-native-url-polyfill'

export const formatearUrl = (url) => {

    const urlParsed = new URL(url)
    let retornar = null

    if (urlParsed.pathname == '/rim/detalle') {
        const params = getParams(urlParsed)
        retornar = { screen: 'solicitudesHome', params: params }
    }


    return retornar
}


const getParams = (a) => {
    let ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s;

    for (; i < len; i++) {
        if (!seg[i]) {
            continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
    }

    return ret;
}