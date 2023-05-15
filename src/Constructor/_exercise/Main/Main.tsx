import React, {ReactElement, Suspense, useState} from 'react';
import Background from 'Layout/Background';
import {ThemeSwitch} from 'Messenger/components';
import {Edit as ExerciseEdit, List as ExerciseList} from 'Constructor/exercise';

export default function Main(): ReactElement {
    const [selectedId, setSelectedId] = useState<string>();

    return (
        <div className='w-screen h-screen'>
            <Background className='p-3'>
                <Suspense>
                    <ThemeSwitch className='absolute right-3 top-3 shadow-md'/>
                </Suspense>
                <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                    <div className='w-full shrink-[2] sm:max-w-[300px] max-h-[200px] sm:max-h-full scrollbar-thin rounded-md'>
                        <ExerciseList selectedId={selectedId}
                                      onExerciseSelected={setSelectedId}/>
                    </div>
                    <div className='w-full shrink max-w-[700px]'>
                        <ExerciseEdit selectedId={selectedId}/>
                    </div>
                </div>
            </Background>
        </div>
    )
}
