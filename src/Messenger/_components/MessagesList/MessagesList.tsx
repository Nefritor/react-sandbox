import clsx from 'clsx';
import {useEffect, useMemo, useRef, useState} from 'react';
import {BiCheck, BiCheckDouble, BiDotsHorizontalRounded, BiErrorCircle} from 'react-icons/bi';

import {dict} from 'Messenger/i18n';

import {formatDateTime} from 'Utils/Date';

import {Sender, Status, IMessage} from 'Messenger/interface';

interface IProps extends Partial<IMessageEvents> {
    list: IMessage[];
}

interface IMessageBlock extends IMessageEvents {
    message: IMessage;
}

interface IMessageEvents {
    onBlockVisible: (data: IMessage) => void;
    onBlockInit: (data: IMessage) => void;
}

const getStatusIcon = (status: Status) => {
    switch (status) {
        case Status.SENDING:
            return <BiDotsHorizontalRounded/>;
        case Status.SENT:
            return <BiCheck/>;
        case Status.READ:
            return <BiCheckDouble/>;
        case Status.ERROR:
            return <BiErrorCircle/>;
    }
}

export default function MessagesList(props: IProps): JSX.Element {
    return (
        <div className='flex
                        flex-col
                        justify-end
                        gap-2
                        h-full'>
            {
                props.list.length ?
                    props.list.map((message) => (
                        <MessageBlock key={message.id}
                                      message={message}
                                      onBlockVisible={(id) => props.onBlockVisible?.(id)}
                                      onBlockInit={(id) => props.onBlockInit?.(id)}/>
                    )) :
                    <div className='flex flex-col items-center justify-center h-full'>
                        <div className='tracking-widest text-2xl'>{dict('Нет сообщений').toUpperCase()}</div>
                    </div>
            }
        </div>
    )
}

function MessageBlock(props: IMessageBlock): JSX.Element {
    const [isVisible, setIsVisible] = useState(false);
    const blockRef = useRef<HTMLDivElement | null>(null);
    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting)
    ), [])

    useEffect(() => {
        props.onBlockInit(props.message);
        if (blockRef.current !== null) {
            observer.observe(blockRef.current);
        }
        return () => {
            observer.disconnect();
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            props.onBlockVisible(props.message);
            observer.disconnect();
        }
    }, [isVisible])

    return (
        <div ref={blockRef}
             className={clsx(
                 'bg-gray-400 flex flex-col w-fit px-2 py-1 min-w-[100px] max-w-[300px] relative shadow-md rounded-t-lg',
                 props.message.sender === Sender.IN ?
                     'self-end rounded-bl-lg' :
                     'rounded-br-lg'
             )}>
            {
                props.message.sender !== Sender.IN &&
                <div className='text-xs leading-none tracking-widest text-gray-600 select-none'>
                    {props.message.senderName}
                </div>
            }
            <div className={clsx(
                'leading-5 break-words',
                (() => {
                    switch (props.message.style) {
                        case 'error':
                            return 'text-red-800';
                        case 'success':
                            return 'text-green-800';
                        default:
                            return 'text-black';
                    }
                })()
            )}>
                {props.message.text}
            </div>
            <div
                className='text-xs self-end leading-3 tracking-tighter text-gray-600 select-none flex gap-0.5 translate-x-1'>
                {formatDateTime(props.message.date)}
                {props.message.status !== undefined && getStatusIcon(props.message.status)}
            </div>
        </div>
    )
}
