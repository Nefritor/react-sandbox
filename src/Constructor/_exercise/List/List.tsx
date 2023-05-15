import React, {ReactElement, useEffect, useState} from 'react';
import {View} from 'Components/list';
import Block from 'Layout/Block';

import {IExerciseBase} from 'Constructor/interface';
import clsx from 'clsx';

interface IProps {
    className?: string
    selectedId: string | undefined;
    onExerciseSelected: (id: string) => void;
}

interface IListElement {
    title: string;
    isSelected: boolean;
}

const data = [{
    id: '0',
    title: 'Жим лёжа'
}, {
    id: '1',
    title: 'Бег на дорожке'
}];

const ListElement = ({title, isSelected}: IListElement) =>
    <div className='relative py-2 px-4 flex'>
        {
            isSelected &&
            <div className='absolute w-[5px] h-[30px] left-1 self-center rounded-full bg-gray-700 dark:bg-gray-200'></div>
        }
        {title}
    </div>

export default function List(props: IProps): ReactElement {
    const [list, setList] = useState<IExerciseBase[]>([]);

    useEffect(() => {
        setList(data);
    }, []);

    return (
        <Block className={clsx('flex flex-col overflow-hidden', [props.className])}
               hasPadding={false}>
            <View list={list}
                  onElementClick={(data) => props.onExerciseSelected(data.id)}
                  item={(item) => <ListElement title={item.title} isSelected={item.id === props.selectedId}/>}/>
        </Block>
    )
}
