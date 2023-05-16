import React, {createRef, ReactElement, Suspense, useState} from 'react';
import Background from 'Layout/Background';
import {ThemeSwitch} from 'Messenger/components';
import {Edit as ExerciseEdit, IListRef, List as ExerciseList} from 'Constructor/exercise';

export default function Main(): ReactElement {
    const [selectedId, setSelectedId] = useState<string>();

    const exerciseListRef = createRef<IListRef>();

    const onExerciseRemove = () => {
        exerciseListRef.current?.reload();
        setSelectedId(undefined);
    }

    return (
        <div className='w-screen h-screen'>
            <Background className='p-3'>
                <Suspense>
                    <ThemeSwitch className='absolute right-3 bottom-3 shadow-md'/>
                </Suspense>
                <div className='flex flex-col sm:flex-row gap-3 justify-center overflow-hidden'>
                    <div
                        className='grow shrink-0 min-h-[80px] max-h-[150px] sm:max-h-full sm:max-w-[300px] scrollbar-thin rounded-md'>
                        <ExerciseList ref={exerciseListRef}
                                      selectedId={selectedId}
                                      onExerciseSelected={setSelectedId}/>
                    </div>
                    <div className='grow min-h-[1px] max-w-[700px]'>
                        <ExerciseEdit selectedId={selectedId}
                                      onExerciseRemove={onExerciseRemove}/>
                    </div>
                </div>
            </Background>
        </div>
    )
}
