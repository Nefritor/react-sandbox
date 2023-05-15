import React, {ReactElement, useEffect, useState} from 'react';
import {IExercise, IExerciseData, TExerciseDataType} from 'Constructor/interface';
import Block from 'Layout/Block';
import {Text} from 'Components/input';
import {RiAddFill} from 'react-icons/ri';
import {HiOutlineTrash} from 'react-icons/hi';
import getUUID from 'react-uuid';
import {defaultMeta} from './Meta/Meta';
import clsx from 'clsx';

interface IProps {
    selectedId: string | undefined;
}

const data = [{
    id: '0',
    title: 'Жим лёжа',
    exerciseData: []
}, {
    id: '1',
    title: 'Бег на дорожке',
    exerciseData: [{
        id: '0',
        type: 'custom',
        meta: {
            name: 'Продолжительность',
            unit: 'минут'
        }
    }, {
        id: '1',
        type: 'custom',
        meta: {
            name: 'Скорость',
            unit: 'км/ч'
        }
    }, {
        id: '2',
        type: 'custom',
        meta: {
            name: 'Наклон',
            unit: '°'
        }
    }]
}] as IExercise[];

export default function Edit(props: IProps): ReactElement {
    const [selectedExercise, setSelectedExercise] = useState<IExercise>();

    const onExerciseDataChange = (id: string, meta: IExerciseData['meta']) => {
        if (data) {
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
        })
    }

    const removeExerciseData = (id: string) => {
        setSelectedExercise((exercise) => {
            if (exercise) {
                return {
                    ...exercise,
                    exerciseData: exercise.exerciseData.filter((data) => data.id !== id)
                }
            }
        })
    }

    useEffect(() => {
        if (props.selectedId) {
            const exercise = data.find((item) => item.id === props.selectedId);
            if (exercise) {
                setSelectedExercise(exercise);
            }
        }
    }, [props.selectedId]);

    return (
        <Block>
            {
                !selectedExercise ?
                    <div>Ничего не выбрано</div> :
                    <div className='flex flex-col gap-3'>
                        <div className='text-xl'>
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
                        </div>
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
                            className='flex justify-center hover:brightness-90 dark:hover:brightness-125 cursor-pointer'
                            onClick={() => addExerciseData('custom')}>
                            <RiAddFill size={20} className='text-gray-600 dark:text-gray-400'/>
                        </Block>
                    </div>
            }
        </Block>
    )
}
