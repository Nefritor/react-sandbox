import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import ReactLoading from 'react-loading';
import getUUID from 'react-uuid';
import {BiCheckCircle, BiErrorCircle} from "react-icons/bi";

interface IElementProps extends IFetcherData {
    offset: number;
    onRemove: () => void;
    onBeforeRemove: () => void;
}

interface IStateConfig {
    caption: string;
}

interface IAdvancedStateConfig extends IStateConfig {
    duration?: number;
}

interface INotificationConfig {
    loading: IStateConfig;
    success?: IAdvancedStateConfig;
    fail?: IAdvancedStateConfig;
}

interface INotificationsListProps {
    config?: IFetcherConfig;
}

interface IFetcherConfig {
    itemsGap: number;
}

interface IFetcherData {
    title: string;
    config: INotificationConfig;
    onClick?: () => void;
    promise: Promise<void>;
}

interface INotificationData {
    uuid: string;
    data: IFetcherData;
    isVisible: boolean;
}

interface IFetcherHandle {
    add: (uuid: string, data: IFetcherData) => void;
}

interface ITimerProps {
    isPlaying?: boolean;
    showAt?: number;
}

type TAdvancedStateType =
    | 'loading'
    | 'success'
    | 'fail';

const getBGColor = (state: TAdvancedStateType) => {
    switch (state) {
        case 'loading':
            return '#d1d5db';
        case 'success':
            return '#81c784';
        case 'fail':
            return '#e57373';
        default:
            return '';
    }
}

const getIcon = (state: TAdvancedStateType) => {
    switch (state) {
        case 'loading':
            return <ReactLoading type='spin' color='#000' height={20} width={20} className='m-[2px]'/>;
        case 'success':
            return <BiCheckCircle/>;
        case 'fail':
            return <BiErrorCircle/>;
        default:
            return;
    }
}

const leadingZero = (value: string) => value.length > 1 ? value : `0${value}`;
const formatTime = (seconds: number) => `${Math.trunc(seconds / 60)}:${leadingZero((seconds % 60).toString())}`;

const Timer = ({isPlaying = false, showAt = 0}: ITimerProps) => {
    const [time, setTime] = useState(0);
    const interval = useRef<number>();

    const setPlaying = (isPlaying: boolean) => {
        if (isPlaying && !interval.current) {
            interval.current = window.setInterval(() => {
                setTime((x) => ++x);
            }, 1000);
        } else if (!isPlaying && interval.current) {
            window.clearInterval(interval.current);
            interval.current = undefined;
        }
    }

    useEffect(() => {
        setPlaying(isPlaying);
        return () => {
            setPlaying(false);
        }
    }, [isPlaying]);

    return (
        <div className={`transition-opacity duration-300 opacity-${showAt <= time ? '100' : '0'}`}>
            {
                formatTime(time)
            }
        </div>
    );
}

const FetcherNotificationElement = memo((props: IElementProps): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);
    const [stateType, setStateType] = useState<TAdvancedStateType>('loading');

    const ref = useRef<HTMLDivElement>(null);

    const onClick = () => {
        if (props.onClick) {
            props.onClick();
        }
        remove();
    }

    const remove = () => {
        setIsVisible(false);
        props.onBeforeRemove();
        setTimeout(() => {
            props.onRemove();
        }, 300);
    };

    const promiseResult = (type: TAdvancedStateType) => {
        if (props.config[type]) {
            setStateType(type);
            if (type !== 'loading') {
                setTimeout(() => {
                    remove();
                }, props.config[type]?.duration || 1000);
            }
        } else {
            remove();
        }
    }

    useEffect(() => {
        setIsVisible(true);
        props.promise
            .then(() => promiseResult('success'))
            .catch(() => promiseResult('fail'));
    }, []);

    return (
        <div ref={ref}
             className='w-fit px-2 gap-2 rounded-md flex absolute shadow-md right-0 cursor-pointer select-none overflow-hidden hover:brightness-95 active:brightness-90'
             style={{
                 bottom: props.offset,
                 height: 55,
                 right: isVisible ? 0 : (ref.current !== null ? -ref.current.offsetWidth - 50 : -500),
                 backgroundColor: getBGColor(stateType),
                 transition: 'right .3s ease, bottom .5s ease, filter .3s ease, background-color .5s ease'
             }}
             onClick={onClick}>
            <div>
                <div className='text-xs text-ellipsis overflow-hidden whitespace-nowrap mt-1'>
                    {props.title}
                </div>
                <div>
                    {props.config[stateType]?.caption}
                </div>
            </div>
            <div className='flex items-center text-2xl mb-3'>
                {getIcon(stateType)}
            </div>
            <div className='absolute text-[10px] right-2 bottom-0.5'>
                <Timer isPlaying={stateType === 'loading'} showAt={2}/>
            </div>
        </div>
    )
})

const FetcherNotificationList = forwardRef((props: INotificationsListProps, ref: React.Ref<object>): JSX.Element => {
    const {itemsGap = 10} = props.config || {};
    const [notifications, setNotifications] = useState<INotificationData[]>([]);

    useImperativeHandle(ref, (): IFetcherHandle => ({
        add: (uuid: string, data: IFetcherData) => {
            setNotifications((item) => [...item, {uuid, data, isVisible: true}])
        }
    }), []);

    const remove = (uuid: string) => {
        setNotifications((item) => item.filter(item => item.uuid !== uuid));
    }

    const beforeRemove = (uuid: string) => {
        setNotifications((item) =>
            item.map(item => item.uuid === uuid ? {...item, isVisible: false} : item));
    }

    return (
        <div className='absolute right-3 bottom-3'>
            {
                notifications.map(({uuid, data}, index, items) => (
                    <FetcherNotificationElement key={uuid}
                                                promise={data.promise}
                                                title={data.title}
                                                config={data.config}
                                                onClick={data.onClick}
                                                offset={items.slice(index + 1).reduce((value, item) => value + (item.isVisible ? (50 + itemsGap) : 0), 0)}
                                                onRemove={() => remove(uuid)}
                                                onBeforeRemove={() => beforeRemove(uuid)}/>
                ))
            }
        </div>
    )
})

export const useFetcher = (config?: IFetcherConfig): [(data: IFetcherData) => void, () => JSX.Element] => {
    const fetcherRef = useRef<IFetcherHandle>(null);
    const fetch = (data: IFetcherData) => {
        if (fetcherRef.current !== null) {
            const uuid = getUUID();
            fetcherRef.current.add(uuid, data);
        }
    }
    return useMemo(() => [
        fetch,
        () => <FetcherNotificationList config={config} ref={fetcherRef}/>
    ], [config]);
}