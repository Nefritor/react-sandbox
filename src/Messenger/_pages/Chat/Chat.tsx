import clsx from 'clsx';
import {AES, enc} from 'crypto-ts';
import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import getUUID from 'react-uuid';
import {MdOutlineKeyboardArrowLeft} from 'react-icons/md';
import {RxCaretDown, RxEyeClosed, RxEyeOpen} from 'react-icons/rx';
import Cookies from 'universal-cookie';

import {getNotificationData, IFetcherData} from 'Components/hooks';
import {Text} from 'Components/input';

import {dict} from 'Messenger/i18n';
import {Constants} from 'Messenger/utils';
import {IWebSocketRef, startWebSocket, updateWebSocketMessage} from 'Messenger/webSocket';


import {IMessage, IMessageData, Sender, Status} from 'Messenger/interface';
import {MessagesList, SecretInput, ThemeSwitch} from 'Messenger/components';

interface IProps {
    roomId: string;
    roomName: string;
    onLeaveRoom: () => void;
    onNotification: (data: IFetcherData) => void;
}

interface IWebSocketData {
    message: string;
    statusChange: {
        id: string;
        status: Status;
    }
}

const cookies = new Cookies();

export default function Chat(props: IProps): JSX.Element {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [messageText, setMessageText] = useState('');
    const [secret, setSecret] = useState('');
    const [secretVisible, setSecretVisible] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [isBottom, setIsBottom] = useState(false);

    const listBottomRef = createRef<HTMLDivElement>();
    const wsRef = useRef<IWebSocketRef>({webSocket: null, errorCount: 0});

    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIsBottom(entry.isIntersecting)
    ), [])

    const onBottomScroll = () => {
        listBottomRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const onSecretChange = (value: string) => {
        setSecret(value);
    };

    const addMessage = (message: IMessage) => {
        setMessages((messages) => [...messages, message]);
    };

    const sendMessage = useCallback(() => {
        if (messageText) {
            const id = getUUID();
            addMessage({
                id,
                sender: 0,
                text: messageText,
                date: Date.now(),
                status: Status.SENDING
            });
            wsRef.current.webSocket?.send(
                JSON.stringify({
                    type: 'message',
                    origin: cookies.get('uuid'),
                    data: JSON.stringify({
                        id,
                        text: AES.encrypt(messageText, secret).toString(),
                        date: Date.now(),
                        senderName: AES.encrypt(cookies.get('username'), secret).toString()
                    })
                })
            );
            setMessageText('');
        }
    }, [messageText, secret]);

    const changeMessage = (id: string, data: Partial<IMessage>) => {
        setMessages((messages) => {
            const index = messages.findIndex((message) => message.id === id);
            if (index !== -1) {
                messages.splice(index, 1, {...messages[index], ...data});
            }
            return [...messages];
        });
    }

    const onCopySecret = () => {
        props.onNotification(getNotificationData(dict('Секретный ключ'), dict('Скопировано в буфер')));
    }

    const onMessageBlockInit = (data: IMessageData) => {
        if (data.sender === Sender.IN) {
            listBottomRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }

    const onMessageBlockVisible = (message: IMessage) => {
        wsRef.current.webSocket?.send(
            JSON.stringify({
                type: 'statusChange',
                origin: message.origin,
                data: JSON.stringify({
                    id: message.id,
                    status: Status.READ
                })
            })
        );
    }

    const onWebSocketMessage = useCallback((message: any) => {
        console.log('MESSAGE', message);
        let data;
        switch (message.type) {
            case 'message':
                data = message.data as IWebSocketData['message'];
                const messageData = JSON.parse(data);
                let isDecrypted = false;
                messageData.text = AES.decrypt(messageData.text, secret).toString(enc.Utf8)
                messageData.senderName = AES.decrypt(messageData.senderName, secret).toString(enc.Utf8);
                if (messageData.text && messageData.senderName) {
                    isDecrypted = true
                }
                if (!isDecrypted) {
                    messageData.text = `[${dict('зашифровано')}]`;
                    messageData.senderName = `[${dict('зашифровано')}]`;
                    messageData.style = 'error';
                }
                addMessage({
                    sender: Sender.OUT,
                    origin: message.origin,
                    ...messageData
                });
                wsRef.current.webSocket?.send(
                    JSON.stringify({
                        type: 'statusChange',
                        origin: message.origin,
                        data: JSON.stringify({
                            id: messageData.id,
                            status: Status.SENT
                        })
                    })
                );
                setTimeout(() => {
                    if (!hasUnread && !isBottom) {
                        setHasUnread(true);
                    }
                }, 100);
                break;
            case 'statusChange':
                data = JSON.parse(message.data) as IWebSocketData['statusChange'];
                changeMessage(data.id, {status: data.status});
                break;
        }
    }, [hasUnread, isBottom, secret]);

    useEffect(() => {
        listBottomRef.current?.scrollIntoView();
        startWebSocket(wsRef, {
            onOpen: () => {
                console.log('OPEN')
            },
            onMessage: onWebSocketMessage,
            onClose: (reason) => {
                console.log('CLOSE', reason)
            }
        }, `room/${props.roomId}/${cookies.get('uuid')}`);
        if (listBottomRef.current !== null) {
            observer.observe(listBottomRef.current);
        }
        return () => {
            wsRef.current.webSocket?.close(Constants.WSCloseCode.CLOSED_BY_USER);
            observer.disconnect();
        }
    }, []);

    useEffect(() => {
        updateWebSocketMessage(wsRef, onWebSocketMessage);
    }, [onWebSocketMessage])

    useEffect(() => {
        if (hasUnread) {
            setHasUnread(false);
        }
    }, [isBottom]);

    return (
        <>
            <div className='flex justify-between items-center mb-3 gap-3'>
                <div className={clsx(
                    'text-2xl tracking-widest overflow-hidden text-gray-700 dark:text-gray-400',
                    'hover:brightness-95 transition-colors cursor-pointer flex items-center select-none'
                )}
                     title={props.roomName}
                     onClick={() => props.onLeaveRoom()}>
                    <MdOutlineKeyboardArrowLeft className='shrink-0'/>
                    <span className='overflow-ellipsis whitespace-nowrap overflow-hidden'>
                        {props.roomName.toUpperCase()}
                    </span>
                </div>
                <div className='flex gap-3 items-center select-none shrink-0'>
                    <div className='cursor-pointer text-gray-400 hover:brightness-90 transition-colors'
                         onClick={() => setSecretVisible((value) => !value)}>
                        {
                            secretVisible ?
                                <RxEyeOpen size={18}/> :
                                <RxEyeClosed size={18}/>
                        }
                    </div>
                    <SecretInput value={secret}
                                 staticPlaceholder={true}
                                 placeholder={dict('Секретный ключ')}
                                 className='bg-gray-300 w-[170px] text-md leading-7 rounded-lg shadow-md'
                                 type={secretVisible ? 'text' : 'password'}
                                 onCopy={onCopySecret}
                                 onChange={onSecretChange}/>
                </div>
            </div>
            <div className={clsx(
                'bg-gray-300 dark:bg-gray-700 rounded-lg grow flex flex-col',
                'min-h-0 mb-3 p-3 shadow-md scrollbar-thin transition-colors'
            )}>
                <div className='grow relative'>
                    <MessagesList list={messages}
                                  onBlockInit={onMessageBlockInit}
                                  onBlockVisible={onMessageBlockVisible}/>
                    {
                        hasUnread &&
                        <div className='flex
                                    items-center
                                    text-white
                                    fixed
                                    bottom-20
                                    left-1/2
                                    -translate-x-1/2
                                    h-6
                                    pr-3
                                    pl-1
                                    text-sm
                                    tracking-widest
                                    bg-gray-700
                                    dark:bg-gray-600
                                    rounded-full
                                    shadow-md
                                    cursor-pointer
                                    hover:brightness-90
                                    transition-colors
                                    select-none'
                             onClick={onBottomScroll}>
                            <RxCaretDown size={20}/>
                            <span>{dict('Новое сообщение').toUpperCase()}</span>
                        </div>
                    }
                    <div ref={listBottomRef}/>
                </div>
            </div>
            <div className='rounded-lg flex w-full shadow-md'>
                <Text className='bg-gray-300 text-md leading-10 w-full'
                      value={messageText}
                      placeholder={`${dict('Напишите сообщение')}...`}
                      staticPlaceholder={true}
                      onChange={setMessageText}
                      onSubmit={sendMessage}
                      onInit={(ref) => ref.current?.focus()}>
                    <div className='overflow-hidden rounded-r-lg shrink-0'>
                        <div className={clsx(
                            'bg-gray-700 dark:bg-gray-500 px-4 cursor-pointer hover:brightness-90',
                            'tracking-widest text-white dark:text-gray-800 transition-all',
                            messageText ?
                                '' :
                                'translate-x-[101%]'
                        )}
                             onClick={(event) => {
                                 event.stopPropagation();
                                 sendMessage();
                             }}>
                            {dict('Отправить').toUpperCase()}
                        </div>
                    </div>
                </Text>
            </div>
        </>
    )
}
