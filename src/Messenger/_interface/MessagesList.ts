export interface IMessage extends IMessageData {
    style?: ITextStyle;
    status?: Status;
}

export interface IMessageData {
    id: string;
    sender: Sender;
    senderName?: string;
    origin?: string;
    text: string;
    date: number;
}
export type ITextStyle =
    | 'default'
    | 'error'
    | 'success';

export enum Sender {
    IN,
    OUT
}

export enum Status {
    SENDING,
    SENT,
    READ,
    ERROR
}
