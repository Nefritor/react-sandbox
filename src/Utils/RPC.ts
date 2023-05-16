import axios, {AxiosResponse} from 'axios';

interface IPort {
    secured: number;
    unsecured: number;
}

interface IController {
    get: (method: string) => Promise<AxiosResponse>;
    post: (method: string, data: Record<string, unknown>) => Promise<AxiosResponse>;
}

interface IControllerData {
    id: string;
    port: IPort;
    controller: IController;
}

const getCurrentPort = (port: IPort) => isSecured ? port.secured : port.unsecured;

const isSecured = window.location.protocol === 'https:';

const controllers: IControllerData[] = [];

export const createController = (id: string, port: IPort) => {
    if (!controllers.some((data) => data.id === id)) {
        const getRequestUrl = (method: string) =>
            `${window.location.protocol}//${window.location.hostname}:${getCurrentPort(port)}/${method}`;

        const get = (method: string) => {
            return axios.get(getRequestUrl(method));
        }
        const post = (method: string, data: Record<string, unknown>) => {
            return axios.post(getRequestUrl(method), data)
        }

        controllers.push({
            id,
            port,
            controller: {
                get,
                post
            }
        });
    }
}

export const getController = (id: string): IController => {
    const controllerData = controllers.find((data) => data.id === id);
    if (controllerData) {
        return controllerData.controller;
    }
    throw Error(`There is no RPC controller with id ${id}`);
}

