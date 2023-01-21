import axiosRoot from 'axios';
import config from '../config.json';

export const axios = axiosRoot.create({
    baseURL: config.api_base_url,
    withCredentials: true,
    // send cookie to server in other domain
    crossDomain: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});