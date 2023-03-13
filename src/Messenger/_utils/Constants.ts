export enum WSCloseCode {
    CLOSED_BY_USER = 3000,
    CLOSED_BY_SERVER = 3001
}

export const isSecured = window.location.protocol === 'https:';
export const webSocketProtocol = isSecured ? 'wss:' : 'ws:';
export const webSocketPort = isSecured ? 3334 : 3333;
