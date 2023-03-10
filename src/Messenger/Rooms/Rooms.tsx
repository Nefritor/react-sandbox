import clsx from 'clsx';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Cookies from 'universal-cookie';

import {Button} from 'Components/button';
import {getNotificationData, IFetcherData} from 'Components/hooks';
import {Text} from 'Components/input';
import {IListElement, View as ListView} from 'Components/list';
import {Edge} from 'Components/popup';

import {CloseCode, IWebSocketRef, startWebSocket} from 'Messenger/RPC/Base';
import {createRoom, getRooms} from 'Messenger/RPC/Rooms';
import {getDictionary} from 'Messenger/I18N/Dictionary';

import UsernameInput from './UsernameInput/UsernameInput';

interface IRoom extends IListElement {
    title: string;
}

interface IProps {
    onRoomSelect: (id: string) => void;
    onNotification: (data: IFetcherData) => void;
}

const cookies = new Cookies();

const dict = getDictionary();

export default function Rooms(props: IProps): JSX.Element {
    const [userName, setUserName] = useState(cookies.get('username'));
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [showRoomCreate, setShowRoomCreate] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const wsRef = useRef<IWebSocketRef>({webSocket: null, errorCount: 0});

    const getRoomItem = useCallback((data: IRoom) => <>{data.title}</>, []);

    const getRoomsEmptyView = useCallback(() => (
        <div className='text-lg text-center py-4'>
            {dict('Список комнат пуст').toUpperCase()}
        </div>
    ), []);

    const onRoomSelect = useCallback((id: string) => {
        wsRef.current.webSocket?.close(CloseCode.CLOSED_BY_USER);
        props.onRoomSelect(id);
    }, []);

    const onCreateRoom = useCallback(() => {
        if (newRoomName) {
            createRoom(newRoomName).then((data) => {
                if (!data) {
                    props.onNotification(getNotificationData(dict('Создать комнату'), 'Room is already exists'));
                }
                onRoomSelect(data);
            });
        } else {
            props.onNotification(getNotificationData(dict('Создать комнату'), dict('Введите корректное название комнаты')));
        }
    }, [newRoomName]);

    const getRoomCreateView = useCallback(() => (
        <div className='mt-3'>
            <Text inputClassName='bg-gray-300 shadow-md h-8 w-full'
                  label={dict('Название').toUpperCase()}
                  value={newRoomName}
                  onChange={setNewRoomName}
                  onSubmit={onCreateRoom}>
                <div className='overflow-hidden rounded-r-lg shrink-0'>
                    <div className={clsx(
                        'bg-gray-700 px-3 cursor-pointer hover:brightness-90',
                        'text-white transition-[transform] leading-8',
                        newRoomName ?
                            '' :
                            'translate-x-[101%]'
                    )}
                         onClick={onCreateRoom}>
                        {dict('Создать').toUpperCase()}
                    </div>
                </div>
            </Text>
        </div>
    ), [newRoomName]);

    useEffect(() => {
        cookies.set('username', userName)
    }, [userName]);

    useEffect(() => {
        getRooms().then((data) => {
            setRooms(data);
        });
        startWebSocket(wsRef, {
            onOpen: () => {
                console.log('OPEN')
            },
            onMessage: (message) => {
                console.log('MESSAGE', message);
                switch (message.type) {
                    case 'rooms':
                        setRooms(message.data as IRoom[])
                        break;
                }
            },
            onClose: (reason) => {
                console.log('CLOSE', reason)
            }
        }, 'rooms');
        return () => wsRef.current.webSocket?.close(CloseCode.CLOSED_BY_USER);
    }, []);

    return (
        <>
            <div className='flex flex-col text-center justify-center tracking-widest mb-3 min-h-[100px] h-[20%]'>
                <div>
                    <span className='text-3xl'>MESSENGER</span>
                    &nbsp;
                    <span className='text-md'>v2</span>
                </div>
            </div>
            <div className='flex flex-col items-center min-h-[75px] h-[15%]'>
                <span className='tracking-widest text-gray-500 text-sm'>
                    {dict('Имя пользователя').toUpperCase()}
                </span>
                <UsernameInput value={userName}
                               onChange={setUserName}
                               onError={() => props.onNotification(getNotificationData(dict('Имя пользователя'), dict('Введите имя пользователя')))}/>
            </div>
            <div className='flex text-xl tracking-widest justify-center mb-3'>
                <div className='flex items-baseline relative'>
                    {dict('Комнаты').toUpperCase()}
                    {
                        !!rooms.length &&
                        <div className='absolute -right-1.5 bottom-0 text-sm text-gray-400 translate-x-full'>
                            {rooms.length}
                        </div>
                    }
                </div>
            </div>
            <div
                className={clsx(
                    'bg-gray-300 rounded-lg min-w-[300px] max-w-[600px] w-[50%]',
                    'self-center overflow-hidden shadow-md mb-3 scrollbar-thin'
                )}>
                <ListView<IRoom>
                    itemClasName='bg-gray-300 leading-10 text-lg text-ellipsis overflow-hidden whitespace-nowrap'
                    list={rooms}
                    item={getRoomItem}
                    emptyView={getRoomsEmptyView()}
                    onElementClick={(data) => onRoomSelect(data.id)}/>
            </div>
            <div className='flex justify-center mb-11'>
                <div className='min-w-[300px] max-w-[600px] w-[50%]'>
                    <Button caption={(showRoomCreate ? dict('Отмена') : dict('Создать комнату')).toUpperCase()}
                            className='rounded-lg shadow-md w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
                            onClick={() => {
                                setNewRoomName('');
                                setShowRoomCreate(!showRoomCreate)
                            }}/>
                    <Edge direction='bottom'
                          value={showRoomCreate ? 'create-room' : null}
                          size={50}
                          layers={[{
                              key: 'create-room',
                              content: getRoomCreateView()
                          }]}/>
                </div>
            </div>
        </>
    )
}