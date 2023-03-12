import axios from 'axios';
import {MutableRefObject} from 'react';

interface IWebSocketCallbacks {
    onOpen: () => void;
    onMessage: (data: { type: string, data: unknown }) => void;
    onError: (errorEvent: Event) => void;
    onClose: (reason: string) => void;
}

export interface IWebSocketRef {
    webSocket: WebSocket | null;
    errorCount: number;
}

export enum CloseCode {
    CLOSED_BY_USER = 3000,
    CLOSED_BY_SERVER = 3001
}

const servicePort = 3333;

const isSecured = window.location.protocol === 'https:';

const getRequestUrl = (method: string) => `${window.location.protocol}//${window.location.hostname}:${servicePort}/${method}`;
const getWebSocketUrl = (params: string) => `ws://${window.location.hostname}:${servicePort}/${params}`;

export const get = (method: string) => {
    return axios.get(getRequestUrl(method));
}
export const post = (method: string, data: Record<string, unknown>) => {
    return axios.post(getRequestUrl(method), data)
}

export const startWebSocket = (wsRef: MutableRefObject<IWebSocketRef>, callbacks: Partial<IWebSocketCallbacks>, params?: string) => {
    wsRef.current.webSocket = new WebSocket(getWebSocketUrl(params || ''));
    wsRef.current.webSocket.onopen = () => {
        wsRef.current.errorCount = 0;
        callbacks.onOpen?.();
    }
    wsRef.current.webSocket.onmessage = (message) => {
        callbacks.onMessage?.(JSON.parse(message.data));
    }
    wsRef.current.webSocket.onerror = (error) => {
        wsRef.current.errorCount++;
        callbacks.onError?.(error);
    }
    wsRef.current.webSocket.onclose = (event) => {
        switch (event.code) {
            case CloseCode.CLOSED_BY_USER:
            case CloseCode.CLOSED_BY_SERVER:
                callbacks.onClose?.(event.reason);
                break;
            default:
                if (wsRef.current.errorCount >= 3) {
                    callbacks.onClose?.('Сервер не отвечает');
                } else {
                    setTimeout(() => {
                        startWebSocket(wsRef, callbacks, params);
                    }, 3000);
                }
                break;
        }
    }
}

export const updateWebSocketMessage = (
    wsRef: MutableRefObject<IWebSocketRef>,
    onMessage: IWebSocketCallbacks['onMessage']
): void => {
    if (wsRef.current.webSocket) {
        wsRef.current.webSocket.onmessage = (message) => {
            onMessage(JSON.parse(message.data));
        }
    }
}