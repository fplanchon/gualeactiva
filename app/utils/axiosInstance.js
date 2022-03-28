
import axios from "axios";
import constantes from "./constantes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../navigations/RootNavigation';

const axiosInstance = axios.create({
    baseURL: constantes.API,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(

    async (config) => {

        const userToken = await AsyncStorage.getItem('userToken');
        ///config.data['jwt'] = userToken;
        config.headers.common['user-token'] = userToken
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

export default axiosInstance