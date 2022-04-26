import React from "react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { AuthContext } from "../contexts/AuthContext"
import constantes from "../utils/constantes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../navigations/RootNavigation';


const axiosInstance = axios.create({
    baseURL: constantes.API,
    headers: {
        "Content-Type": "application/json, text/plain",
        "Accept": "application/json, text/plain",
        "content-type": "application/json, text/plain",
    },
});

axiosInstance.interceptors.request.use(

    async (config) => {

        //Metodo para enviar el token sin el usecontext. 
        //const userToken = await AsyncStorage.getItem('userToken');

        // config.headers.common['user-token'] = userToken
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (err.response) {
            // Access Token was expired
            /*if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const rs = await refreshToken();
                    const { accessToken } = rs.data;
                    window.localStorage.setItem("accessToken", accessToken);
                    instance.defaults.headers.common["x-access-token"] = accessToken;
                    return instance(originalConfig);
                } catch (_error) {
                    if (_error.response && _error.response.data) {
                        return Promise.reject(_error.response.data);
                    }
                    return Promise.reject(_error);
                }
            }*/

            if (err.response.status === 401 && err.response.data) {
                RootNavigation.navigate('Logout');
            }
        }
        return Promise.reject(err);
    }
);



const useAxios = (configParams) => {

    const [res, setRes] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginState } = React.useContext(AuthContext);

    configParams = {
        ...configParams,
        headers: { common: { 'user-token': loginState.userToken } }
    }

    useEffect(() => {
        refetch(configParams);
    }, []);

    const refetch = async () => {
        //console.log(configParams)
        setLoading(true);
        await axiosInstance.request(configParams)
            .then(res => setRes(res))
            .catch(err => setErr(err))
            .finally(() => setLoading(false))
    }

    return { res, err, loading, refetch };
}

export default useAxios;