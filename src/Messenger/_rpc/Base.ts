import axios from 'axios';
import {Constants} from 'Messenger/utils';

const getRequestUrl = (method: string) =>
    `${window.location.protocol}//${window.location.hostname}:${Constants.webSocketPort}/${method}`;

export const get = (method: string) => {
    return axios.get(getRequestUrl(method));
}
export const post = (method: string, data: Record<string, unknown>) => {
    return axios.post(getRequestUrl(method), data)
}
