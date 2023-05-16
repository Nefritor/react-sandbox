import React, {createRef, ReactElement, useEffect, useRef, useState} from 'react';
import {IExercise, IExerciseData, TExerciseDataType} from 'Constructor/interface';
import Block from 'Layout/Block';
import {Text} from 'Components/input';
import {RiAddFill} from 'react-icons/ri';
import {HiOutlineTrash} from 'react-icons/hi';
import getUUID from 'react-uuid';
import {defaultMeta} from './Meta/Meta';
import clsx from 'clsx';
import {getExercise, removeExercise as sendRemoveExercise} from 'Constructor/rpc';

interface IProps {
    selectedId: string | undefined;
    onExerciseRemove: () => void
}

export default function Edit(props: IProps): ReactElement {
    const [selectedExercise, setSelectedExercise] = useState<IExercise>();

    const addButtonRef = createRef<HTMLDivElement>();
    const needScroll = useRef<boolean>(false);

    const onExerciseDataChange = (id: string, meta: IExerciseData['meta']) => {
        setSelectedExercise((exercise) => {
            if (exercise) {
                return {
                    ...exercise,
                    exerciseData: exercise.exerciseData.map((data) => {
                        if (data.id === id) {
                            return {
                                ...data,
                                meta
                            };
                        }
                        return data;
                    })
                }
            }
        })
    }

    const addExerciseData = (type: TExerciseDataType) => {
        setSelectedExercise((exercise) => {
            if (exercise) {
                return {
                    ...exercise,
                    exerciseData: [
                        ...exercise.exerciseData,
                        {
                            id: getUUID(),
                            type: type,
                            meta: defaultMeta[type]
                        }
                    ]
                }
            }
        });
        needScroll.current = true;
    }

    const removeExerciseData = (id: string) => {
        setSelectedExercise((exercise) => {
            if (exercise) {
                return {
                    ...exercise,
                    exerciseData: exercise.exerciseData.filter((data) => data.id !== id)
                }
            }
        });
    }

    const removeExercise = () => {
        if (props.selectedId) {
            sendRemoveExercise(props.selectedId).then(() => {
                props.onExerciseRemove();
            });
        }
    }

    useEffect(() => {
        if (props.selectedId) {
            getExercise(props.selectedId).then((res) => {
                setSelectedExercise(res.data);
            })
        } else {
            setSelectedExercise(undefined);
        }
    }, [props.selectedId]);

    useEffect(() => {
        if (needScroll.current) {
            needScroll.current = false;
            addButtonRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [selectedExercise]);

    return (
        <Block className={clsx('flex flex-col max-h-full h-fit', {hidden: !selectedExercise && !props.selectedId})}>
            {
                !selectedExercise ?
                    <div className='dark:text-gray-400'>Данных нет</div> :
                    <div className='flex flex-col gap-3 min-h-[1px]'>
                        <div className='flex shrink-0 text-xl'>
                            <Text value={selectedExercise.title}
                                  background={'contrast'}
                                  placeholder='Название упражнения'
                                  onChange={(value) => setSelectedExercise((exercise) => {
                                      if (exercise) {
                                          return {
                                              ...exercise,
                                              title: value
                                          }
                                      }
                                  })}/>
                            <div className={clsx(
                                'h-fit p-2 rounded-full bg-gray-200 dark:bg-gray-700',
                                'hover:brightness-90 dark:hover:brightness-125 cursor-pointer')}
                                 onClick={() => removeExercise()}>
                                <HiOutlineTrash size={20} className='text-gray-600 dark:text-gray-400'/>
                            </div>
                        </div>
                        <div className='grow flex flex-col gap-3 scrollbar-thin'>
                            {
                                selectedExercise.exerciseData.map((data) => (
                                    <Block className='relative'
                                           key={data.id}>
                                        <div className={clsx(
                                            'absolute h-fit right-2 top-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700',
                                            'hover:brightness-90 dark:hover:brightness-125 cursor-pointer'
                                        )}
                                             onClick={() => removeExerciseData(data.id)}>
                                            <HiOutlineTrash size={20} className='text-gray-600 dark:text-gray-400'/>
                                        </div>
                                        <div className='text-gray-500 text-sm'>type: {data.type}</div>
                                        <Text value={data.meta.name}
                                              background={'contrast'}
                                              label='Название'
                                              onChange={(value) =>
                                                  onExerciseDataChange(data.id, {...data.meta, name: value})}/>
                                        <Text value={data.meta.unit}
                                              background={'contrast'}
                                              label='Единица'
                                              onChange={(value) =>
                                                  onExerciseDataChange(data.id, {...data.meta, unit: value})}/>
                                    </Block>
                                ))
                            }
                            <Block
                                ref={addButtonRef}
                                className='flex justify-center hover:brightness-90 dark:hover:brightness-125 cursor-pointer'
                                onClick={() => addExerciseData('custom')}>
                                <RiAddFill size={20} className='text-gray-600 dark:text-gray-400'/>
                            </Block>
                        </div>
                    </div>
            }
        </Block>
    )
}
