import { MutableRefObject } from 'react';
import { Constants } from 'Messenger/utils';

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

const getWebSocketUrl = (params: string) =>
    `${Constants.webSocketProtocol}//${window.location.hostname}:${Constants.webSocketPort}/${params}`;

export const startWebSocket = (wsRef: MutableRefObject<IWebSocketRef>, callbacks: Partial<IWebSocketCallbacks>, params?: string) => {
    wsRef.current.webSocket = new WebSocket(getWebSocketUrl(params || ''));
    wsRef.current.webSocket.onopen = () => {
        wsRef.current.errorCount = 0;
        callbacks.onOpen?.();
    };
    wsRef.current.webSocket.onmessage = (message) => {
        callbacks.onMessage?.(JSON.parse(message.data));
    };
    wsRef.current.webSocket.onerror = (error) => {
        wsRef.current.errorCount++;
        callbacks.onError?.(error);
    };
    wsRef.current.webSocket.onclose = (event) => {
        switch (event.code) {
            case Constants.WSCloseCode.CLOSED_BY_USER:
            case Constants.WSCloseCode.CLOSED_BY_SERVER:
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
    };
};

export const updateWebSocketMessage = (
    wsRef: MutableRefObject<IWebSocketRef>,
    onMessage: IWebSocketCallbacks['onMessage']
): void => {
    if (wsRef.current.webSocket) {
        wsRef.current.webSocket.onmessage = (message) => {
            onMessage(JSON.parse(message.data));
        };
    }
};
