import React, {CSSProperties, ReactNode, useEffect, useState} from 'react';
import Block from 'Layout/Block';
import clsx from 'clsx';
import {callEvery, EveryType, getWeekDay} from 'Utils/Date';

interface IProps extends IItemData {
    className?: string;
    style?: CSSProperties;
    size: {
        height: number;
        width: number;
    };
    bottomContent?: (props: IItemData) => ReactNode;
}

export interface IItemData {
    date: Date;
    weekday: number;
    isActive: boolean;
}

const getIsToady = (date: Date): boolean => {
    const now = new Date();
    return date.getTime() === now.setHours(0, 0, 0, 0);
}

export default function Item(props: IProps): JSX.Element {
    const [isToday, setIsToday] = useState<boolean>(getIsToady(props.date));

    useEffect(() => {
        callEvery( () => setIsToday(getIsToady(props.date)), EveryType.Day);
    }, [isToday, props.date]);

    return (
        <Block className={clsx(
            'select-none dark:text-white',
            isToday ?
                'bg-gray-500 dark:bg-gray-800 text-white' :
                props.weekday > 4 ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700',
            {
                'opacity-10': !isToday && !props.isActive
            },
            [props.className]
        )}
               hasPadding={false}
               hasBackground={false}
               hasBorder={false}
               style={{
                   width: props.size.width,
                   height: props.size.height,
               }}>
            <div className={clsx('flex px-2')}>
                <div className='text-3xl'>{props.date.getDate()}</div>
                <div className='flex-grow text-right text-sm'>{getWeekDay(props.date)}</div>
            </div>
            {
                props.bottomContent &&
                props.bottomContent({date: props.date, isActive: props.isActive, weekday: props.weekday})
            }
        </Block>
    )
}
