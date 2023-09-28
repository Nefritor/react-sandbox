import React, { createRef, ReactElement, useEffect, useRef, useState } from 'react';
import { IExercise, IExerciseData, TExerciseDataType } from 'Constructor/interface';
import Block from 'Layout/Block';
import { Text } from 'Components/input';
import { RiAddFill, RiCheckLine } from 'react-icons/ri';
import { GrUndo } from 'react-icons/gr';
import { HiOutlineTrash } from 'react-icons/hi';
import getUUID from 'react-uuid';
import { defaultMeta } from './Meta/Meta';
import clsx from 'clsx';
import { deleteExercise, readExercise, updateExercise } from 'Constructor/rpc';

interface IProps {
    selectedId: string | undefined;
    onExerciseRemove: () => void;
    onExerciseUpdate: (prevData: IExercise, nextData: IExercise) => void;
}

export default function Edit(props: IProps): ReactElement {
    const [ exercise, setExercise ] = useState<IExercise>();
    const [ isChanged, setIsChanged ] = useState<boolean>(false);

    const addButtonRef = createRef<HTMLDivElement>();
    const memoryExercise = useRef<IExercise>();
    const needScroll = useRef<boolean>(false);

    const onExerciseDataChange = (id: string, meta: IExerciseData['meta']) => {
        setExercise((exercise) => {
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
                };
            }
        });
    };

    const addExerciseData = (type: TExerciseDataType) => {
        setExercise((exercise) => {
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
                };
            }
        });
        needScroll.current = true;
    };

    const removeExerciseData = (id: string) => {
        setExercise((exercise) => {
            if (exercise) {
                return {
                    ...exercise,
                    exerciseData: exercise.exerciseData.filter((data) => data.id !== id)
                };
            }
        });
    };

    const _deleteExercise = () => {
        if (props.selectedId) {
            deleteExercise(props.selectedId).then(() => {
                props.onExerciseRemove();
            });
        }
    };

    const _updateExercise = () => {
        if (exercise) {
            updateExercise(exercise).then(() => {
                setIsChanged(false);
                if (memoryExercise.current) {
                    props.onExerciseUpdate(memoryExercise.current, exercise);
                    memoryExercise.current = exercise;
                }
            });
        }
    };

    const revertExercise = () => {
        if (memoryExercise.current) {
            setExercise(memoryExercise.current);
        }
    };

    useEffect(() => {
        if (props.selectedId) {
            readExercise(props.selectedId).then((res) => {
                setExercise(res.data);
                memoryExercise.current = res.data;
            });
        } else {
            setExercise(undefined);
        }
    }, [ props.selectedId ]);

    useEffect(() => {
        if (!isChanged && memoryExercise.current !== exercise) {
            setIsChanged(true);
        } else if (isChanged && memoryExercise.current === exercise) {
            setIsChanged(false);
        }
        if (needScroll.current) {
            needScroll.current = false;
            addButtonRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [ exercise ]);

    return (
        <Block className={clsx('flex flex-col max-h-full h-fit', { hidden: !exercise && !props.selectedId })}>
            {
                !exercise ?
                    <div className="dark:text-gray-400">Данных нет</div> :
                    <div className="flex flex-col gap-3 min-h-[1px]">
                        <div className="flex shrink-0 text-xl justify-between items-end">
                            <Text value={exercise.title}
                                  className="mr-1 grow"
                                  placeholder="Название упражнения"
                                  onChange={(value) => setExercise((exercise) => {
                                      if (exercise) {
                                          return {
                                              ...exercise,
                                              title: value
                                          };
                                      }
                                  })}/>
                            <div className="flex gap-1">
                                {
                                    isChanged &&
                                    <>
                                        <div className={clsx(
                                            'h-fit p-3 rounded-full bg-gray-200 dark:bg-gray-700',
                                            'hover:brightness-90 dark:hover:brightness-125 cursor-pointer')}
                                             onClick={() => revertExercise()}>
                                            <GrUndo size={20} className="text-gray-600 dark:text-gray-400"/>
                                        </div>
                                        <div className={clsx(
                                            'h-fit p-3 rounded-full bg-gray-200 dark:bg-gray-700',
                                            'hover:brightness-90 dark:hover:brightness-125 cursor-pointer')}
                                             onClick={() => _updateExercise()}>
                                            <RiCheckLine size={20} className="text-green-600 dark:text-green-400"/>
                                        </div>
                                    </>
                                }
                                <div className={clsx(
                                    'h-fit p-3 rounded-full bg-gray-200 dark:bg-gray-700',
                                    'hover:brightness-90 dark:hover:brightness-125 cursor-pointer')}
                                     onClick={() => _deleteExercise()}>
                                    <HiOutlineTrash size={20} className="text-red-600 dark:text-red-400"/>
                                </div>
                            </div>
                        </div>
                        <div className="grow flex flex-col gap-3 scrollbar-thin">
                            {
                                exercise.exerciseData.map((data) => (
                                    <Block className="flex flex-col relative gap-3"
                                           key={data.id}>
                                        <div className={clsx(
                                            'absolute h-fit right-2 top-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700',
                                            'hover:brightness-90 dark:hover:brightness-125 cursor-pointer'
                                        )}
                                             onClick={() => removeExerciseData(data.id)}>
                                            <HiOutlineTrash size={20} className="text-red-600 dark:text-red-400"/>
                                        </div>
                                        <div className="text-gray-500 text-sm">type: {data.type}</div>
                                        <Text value={data.meta.name}
                                              label="Название"
                                              onChange={(value) =>
                                                  onExerciseDataChange(data.id, { ...data.meta, name: value })}/>
                                        <Text value={data.meta.unit}
                                              label="Единица"
                                              onChange={(value) =>
                                                  onExerciseDataChange(data.id, { ...data.meta, unit: value })}/>
                                    </Block>
                                ))
                            }
                            <Block
                                ref={addButtonRef}
                                className="flex justify-center hover:brightness-90 dark:hover:brightness-125 cursor-pointer"
                                onClick={() => addExerciseData('custom')}>
                                <RiAddFill size={20} className="text-gray-600 dark:text-gray-400"/>
                            </Block>
                        </div>
                    </div>
            }
        </Block>
    );
}
