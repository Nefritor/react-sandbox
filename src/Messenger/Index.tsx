import React, {useState} from 'react';
import getUUID from 'react-uuid';
import Cookies from 'universal-cookie';

import {useFetcher} from 'Components/hooks';

import Chat from 'Messenger/Chat/Chat';
import Rooms from 'Messenger/Rooms/Rooms';
import {getRoomData} from 'Messenger/RPC/Rooms';

import {getDictionary} from './I18N/Dictionary';

interface IRoomData {
    id: string;
    title: string;
}

const dict = getDictionary();

const cookies = new Cookies();

if (!cookies.get('uuid')) {
    cookies.set('uuid', getUUID());
}
if (!cookies.get('username')) {
    cookies.set('username', dict('Аноним'));
}

export default function Index(): JSX.Element {
    const [fetch, Fetcher] = useFetcher();
    const [roomData, setRoomData] = useState<IRoomData | null>(null);

    const onRoomSelect = (id: string) => {
        getRoomData(id).then((data: IRoomData) => {
            setRoomData(data);
        })
    }

    const getPage = (roomData: IRoomData | null): JSX.Element => {
        if (roomData) {
            return <Chat roomId={roomData.id}
                         roomName={roomData.title}
                         onLeaveRoom={() => setRoomData(null)}
                         onNotification={(data) => fetch(data)}/>
        }
        return <Rooms onRoomSelect={onRoomSelect}
                      onNotification={(data) => fetch(data)}/>;
    }

    return (
        <div className='flex flex-col w-screen h-screen p-3 overflow-hidden relative fixed'>
            {getPage(roomData)}
            <Fetcher/>
        </div>
    )
}