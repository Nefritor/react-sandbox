import React, {
    createRef,
    ForwardedRef,
    forwardRef,
    ReactElement,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState
} from 'react';
import {View} from 'Components/list';
import Block from 'Layout/Block';

import {IExerciseBase} from 'Constructor/interface';

import {createExercise, getExerciseList} from 'Constructor/rpc';

import clsx from 'clsx';
import {RiAddFill, RiCheckLine} from 'react-icons/ri';
import getUUID from 'react-uuid';
import {Text} from 'Components/input';
import {RxCross2} from 'react-icons/rx';

interface IProps {
    className?: string
    selectedId: string | undefined;
    onExerciseSelected: (id: string) => void;
}

export interface IRef {
    reload: () => void
}

const List = forwardRef((props: IProps, ref: ForwardedRef<IRef>): ReactElement => {
    const [list, setList] = useState<IExerciseBase[]>([]);
    const [editingConfig, setEditingConfig] = useState<IExerciseBase>();

    useImperativeHandle(ref, (): IRef => ({
        reload: () => {
            loadData();
        }
    }));

    const markerRef = createRef<HTMLDivElement>();

    const inputRef = createRef<HTMLInputElement>();

    const addExercise = () => {
        setEditingConfig({
            id: getUUID(),
            title: ''
        });
    }

    const saveEditingExercise = () => {
        if (editingConfig) {
            createExercise(editingConfig).then(() => {
                cancelEditing();
                loadData().then(() => {
                    props.onExerciseSelected(editingConfig.id);
                });
            })
        }
    }

    const cancelEditing = () => {
        setEditingConfig(undefined);
    }

    const changeEditingTitle = (value: string) => {
        if (editingConfig) {
            setEditingConfig({...editingConfig, title: value});
        }
    }

    const loadData = (): Promise<void> => {
        return getExerciseList().then((response) => {
            setList(response.data);
        })
    }

    const listItem = useCallback(({id, title}: IExerciseBase) =>
            <div className='relative flex'>
                {
                    id === props.selectedId &&
                    <div ref={markerRef}
                         className='absolute w-[5px] h-[30px] left-1 self-center rounded-full bg-gray-500'/>
                }
                <span className='px-4 py-2 text-ellipsis overflow-hidden'>{title}</span>
            </div>,
        [props.selectedId]
    )

    useEffect(() => {
        if (editingConfig) {
            inputRef.current?.focus();
        }
    }, [editingConfig]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        markerRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [props.selectedId]);

    return (
        <div className='flex flex-col gap-3 min-w-[1px]'>
            <Block className={clsx(
                'flex flex-col overflow-hidden  min-h-[40px] max-h-[150px] sm:max-h-full scrollbar-thin',
                [props.className]
            )}
                   hasPadding={false}>
                <View list={list}
                      emptyText='Cписок пуст'
                      onElementClick={(data) => props.onExerciseSelected(data.id)}
                      item={listItem}/>
            </Block>
            {
                !editingConfig ?
                    <Block className='flex justify-center hover:brightness-90 dark:hover:brightness-125 cursor-pointer'
                           onClick={() => addExercise()}>
                        <RiAddFill size={20} className='text-gray-600 dark:text-gray-400'/>
                    </Block> :
                    <div className='flex grow leading-9 items-center'>
                        <Text ref={inputRef}
                              className='mr-2 grow min-w-[1px]'
                              inputClassName='px-4'
                              placeholderClassName='px-4'
                              value={editingConfig.title}
                              onChange={changeEditingTitle}
                              staticPlaceholder={true}
                              placeholder='Название упражнения'/>
                        {
                            editingConfig.title &&
                            <div
                                className='p-3 text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'
                                onClick={() => saveEditingExercise()}>
                                <RiCheckLine/>
                            </div>
                        }
                        <div className='p-3 text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'
                             onClick={() => cancelEditing()}>
                            <RxCross2/>
                        </div>
                    </div>
            }
        </div>

    )
});

export default List;
