import React, {forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import ReactLoading from 'react-loading';
import getUUID from 'react-uuid';
import {BiCheckCircle, BiErrorCircle} from "react-icons/bi";
import clsx from 'clsx';
import timeout from 'Utils/Timeout';

interface IElementProps extends IFetcherData {
    offset: number;
    onRemove: () => void;
    onBeforeRemove: () => void;
}

interface IStateConfig {
    caption: string;
    blockClass?: string;
}

interface IAdvancedStateConfig extends IStateConfig {
    duration?: number;
}

interface INotificationConfig {
    loading: IStateConfig;
    success?: IAdvancedStateConfig;
    fail?: IAdvancedStateConfig;
    showIcon?: boolean;
    showTimer?: boolean;
}

interface INotificationsListProps {
    config?: IFetcherConfig;
}

interface IFetcherConfig {
    itemsGap: number;
}

export interface IFetcherData {
    title?: string;
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

const getBGClass = (state: TAdvancedStateType, config: INotificationConfig) => {
    switch (state) {
        case 'loading':
            return config.loading.blockClass || 'bg-gray-300 dark:bg-gray-700';
        case 'success':
            return config.success?.blockClass || 'bg-[#81c784] dark:bg-[#345035]';
        case 'fail':
            return config.fail?.blockClass || 'bg-[#e57373] dark:bg-[#492525]';
        default:
            return '';
    }
}

const getIcon = (state: TAdvancedStateType) => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    switch (state) {
        case 'loading':
            return <ReactLoading type='spin' color={isDarkMode ? '#9ca3af' : '#000'} height={20} width={20}
                                 className='m-[2px]'/>;
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

    const onClick = useCallback(() => {
        if (props.onClick) {
            props.onClick();
        }
        remove();
    }, [])

    const remove = useCallback(() => {
        setIsVisible(false);
        props.onBeforeRemove();
        setTimeout(() => {
            props.onRemove();
        }, 300);
    }, []);

    const promiseResult = useCallback((type: TAdvancedStateType) => {
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
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
            props.promise
                .then(() => promiseResult('success'))
                .catch(() => promiseResult('fail'));
        }, 100);
    }, []);

    return (
        <div ref={ref}
             className={clsx(
                 'w-fit px-2 gap-2 rounded-md flex absolute shadow-md right-0 cursor-pointer select-none overflow-hidden',
                 'hover:brightness-95 active:brightness-90 dark:text-gray-400',
                 getBGClass(stateType, props.config)
             )}
             style={{
                 bottom: props.offset + 10,
                 height: 55,
                 right: isVisible ? 10 : (ref.current !== null ? -ref.current.offsetWidth - 50 : -500),
                 transition: 'right .3s ease, bottom .5s ease, filter .3s ease, background-color .5s ease'
             }}
             onClick={onClick}>
            <div>
                {
                    props.title &&
                    <div className='text-xs text-ellipsis overflow-hidden whitespace-nowrap mt-1'>
                        {props.title}
                    </div>
                }
                <div className='whitespace-nowrap'>
                    {props.config[stateType]?.caption}
                </div>
            </div>
            {
                (props.config.showIcon === undefined || props.config.showIcon) &&
                <div className='flex items-center text-2xl mb-3'>
                    {getIcon(stateType)}
                </div>
            }
            {
                (props.config.showTimer === undefined || props.config.showTimer) &&
                <div className='absolute text-[10px] right-2 bottom-0.5'>
                    <Timer isPlaying={stateType === 'loading'} showAt={2}/>
                </div>
            }
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
        <>
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
        </>
    )
})

export const getNotificationData = (title: string, text: string) => {
    return {
        title: title,
        config: {
            loading: {
                caption: text,
                blockClass: 'bg-gray-600 text-white'
            },
            showTimer: false,
            showIcon: false
        },
        promise: timeout()
    }
}

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