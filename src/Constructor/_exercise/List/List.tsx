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
import {Text} from 'Components/input';
import Block from 'Layout/Block';

import {IExerciseBase} from 'Constructor/interface';

import {getExerciseList, addExercise as sendAddExercise} from 'Constructor/rpc';

import clsx from 'clsx';
import {RiAddFill, RiCheckLine} from 'react-icons/ri';
import {RxCross2} from 'react-icons/rx';
import getUUID from 'react-uuid';

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
    const [editingId, setEditingId] = useState<string>();

    useImperativeHandle(ref, (): IRef => ({
        reload: () => {
            reloadData();
        }
    }));

    const inputRef = createRef<HTMLInputElement>();

    const addExercise = () => {
        const newItemId = getUUID();
        setList((list) => [
            ...list,
            {
                id: newItemId,
                title: ''
            }
        ]);
        setEditingId(newItemId);
    }

    const saveEditingExercise = (data: {id: string, title: string}) => {
        if (editingId) {
            list.find((data) => data.id === editingId)
            sendAddExercise(data).then(() => {
                cancelEditing();
                reloadData().then(() => {
                    props.onExerciseSelected(editingId);
                });
            })
        }
    }

    const cancelEditing = () => {
        setList((list) => list.filter((data) => data.id !== editingId));
        setEditingId(undefined);
    }

    const changeEditingTitle = (value: string) => {
        setList((list) => list.map((data) => {
            if (data.id !== editingId) {
                return data
            }
            return {
                ...data,
                title: value
            }
        }));
    }

    const reloadData = (): Promise<void> => {
        return getExerciseList().then((response) => {
            setList(response.data);
        })
    }

    const listItem = useCallback(({id, title}: IExerciseBase) =>
            <div className='relative py-2 flex'>
                {
                    id === props.selectedId &&
                    <div
                        className='absolute w-[5px] h-[30px] left-1 self-center rounded-full bg-gray-700 dark:bg-gray-200'/>
                }
                {
                    id !== editingId ?
                        <span className='px-4'>{title}</span> :
                        <div className='px-2 flex items-center grow gap-1'>
                            <Text ref={inputRef}
                                  value={title}
                                  onChange={changeEditingTitle}
                                  background={'contrast'}
                                  placeholder='Название упражнения'
                                  staticPlaceholder={true}/>
                            {
                                title &&
                                <div className='rounded-full p-1 bg-gray-700 hover:brightness-125'
                                     onClick={() => saveEditingExercise({id, title})}>
                                    <RiCheckLine/>
                                </div>
                            }
                            <div className='rounded-full p-1 bg-gray-700 hover:brightness-125'
                                 onClick={() => cancelEditing()}>
                                <RxCross2/>
                            </div>
                        </div>
                }
            </div>,
        [editingId, props.selectedId]
    )

    useEffect(() => {
        if (editingId) {
            inputRef.current?.focus();
        }
    }, [editingId]);

    useEffect(() => {
        reloadData();
    }, []);

    return (
        <div className='flex flex-col gap-3'>
            <Block className={clsx('flex flex-col overflow-hidden', [props.className])}
                   hasPadding={false}>
                <View list={list}
                      onElementClick={(data) => {
                          if (data.id !== editingId) {
                              props.onExerciseSelected(data.id)
                          }
                      }}
                      item={listItem}/>
            </Block>
            {
                !editingId &&
                <Block className='flex justify-center hover:brightness-90 dark:hover:brightness-125 cursor-pointer'
                       onClick={() => !editingId && addExercise()}>
                    <RiAddFill size={20} className='text-gray-600 dark:text-gray-400'/>
                </Block>
            }
        </div>

    )
});

export default List;
