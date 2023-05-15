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
                <div className='flex gap-3'>
                    <div className='w-full shrink-[2]'>
                        <ExerciseList selectedId={selectedId}
                                      onExerciseSelected={setSelectedId}/>
                    </div>
                    <div className='w-full shrink'>
                        <ExerciseEdit selectedId={selectedId}/>
                    </div>
                </div>
            </Background>
        </div>
    )
}
