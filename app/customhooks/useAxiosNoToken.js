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
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(

    async (config) => {
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

        }
        return Promise.reject(err);
    }
);



const useAxiosNoToken = (configParams) => {

    const [res, setRes] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginState } = React.useContext(AuthContext);

    //console.log(configParams);
    /*useEffect(() => {
        refetch(configParams);
    }, []);*/

    const refetch = async () => {

        setLoading(true);
        await axiosInstance.request(configParams)
            .then((res) => {
                setErr('')
                setRes(res)
            })
            .catch((err) => {
                setRes('')
                setErr(err)
                console.log('useAxiosNoTokenError', err)
            })
            .finally(() => setLoading(false))
    }

    return { res, err, loading, refetch };
}

export default useAxiosNoToken;