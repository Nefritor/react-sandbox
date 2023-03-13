import React, {useState} from 'react';
import getUUID from 'react-uuid';
import Cookies from 'universal-cookie';

import {useFetcher} from 'Components/hooks';

import {Chat, Rooms} from 'Messenger/pages';
import {Rooms as RoomsRPC} from 'Messenger/rpc';

import {dict} from 'Messenger/i18n';

interface IRoomData {
    id: string;
    title: string;
}

const cookies = new Cookies();

if (!cookies.get('uuid')) {
    cookies.set('uuid', getUUID());
}
if (!cookies.get('username')) {
    cookies.set('username', dict('Аноним'));
}

export default function Main(): JSX.Element {
    const [fetch, Fetcher] = useFetcher();
    const [roomData, setRoomData] = useState<IRoomData | null>(null);

    const onRoomSelect = (id: string) => {
        RoomsRPC.getRoomData(id).then((data: IRoomData) => {
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
        <div className='bg-white dark:bg-gray-900 flex flex-col w-screen h-screen p-3 overflow-hidden relative fixed transition-colors'>
            {getPage(roomData)}
            <Fetcher/>
        </div>
    )
}
