import axios, {AxiosResponse} from 'axios';

interface IPostData {
    service: string;
    method: string;
    data?: Record<string, unknown>;
}

interface IRPCData {
    name: string;
    port: number;
    post: (method: string, data?: IPostData['data']) => Promise<AxiosResponse>;
}

const rpcList: IRPCData[] = [];

export const createRPC = (serviceName: string, port: number) => {
    if (!rpcList.some((data) => data.name === serviceName)) {
        const getRequestUrl = () =>
            `${window.location.protocol}//${window.location.hostname}:${port}`;

        rpcList.push({
            name: serviceName,
            port,
            post: (method, data) => {
                return axios.post(getRequestUrl(), {
                    service: serviceName,
                    method,
                    data
                } as IPostData)
            }
        });
    }
}

export const getRPC = (name: string): IRPCData => {
    const rpcData = rpcList.find((data) => data.name === name);
    if (rpcData) {
        return rpcData;
    }
    throw Error(`There is no RPC controller of "${name}" service`);
}

