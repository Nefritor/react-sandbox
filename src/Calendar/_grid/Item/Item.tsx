import React, {CSSProperties, ReactNode, useMemo} from 'react';
import Block from 'Layout/Block';
import clsx from 'clsx';
import {getWeekDay} from 'Utils/Date';

interface IProps extends IItemData {
    className?: string;
    style?: CSSProperties;
    bottomContent?: (props: IItemData) => ReactNode;
}

export interface IItemData {
    date: Date;
    weekday: number;
    isActive: boolean;
}

const currentDateTime = new Date().setHours(0, 0, 0, 0);

export default function Item(props: IProps): JSX.Element {
    const isToday = useMemo(() => currentDateTime === props.date.getTime(), []);
    return (
        <Block className={clsx(
            'select-none h-fit dark:text-white',
            isToday ?
                'bg-gray-500 dark:bg-gray-800 text-white' :
                props.weekday > 4 ? 'bg-gray-400 dark:bg-gray-500' : 'bg-gray-300 dark:bg-gray-600',
            {
                'opacity-10': !props.isActive
            },
            [props.className]
        )}
               hasPadding={false}
               hasBackground={false}
               hasBorder={false}
               style={props.style}>
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
