import React, { createRef, ReactElement, Suspense, useState } from 'react';
import Background from 'Layout/Background';
import { ThemeSwitch } from 'Messenger/components';
import { Edit as ExerciseEdit, IListRef, List as ExerciseList } from 'Constructor/exercise';
import { Root as ModalRoot } from 'Components/modal';

export default function Main(): ReactElement {
    const [ selectedId, setSelectedId ] = useState<string>();

    const exerciseListRef = createRef<IListRef>();

    const onExerciseRemove = () => {
        exerciseListRef.current?.reload();
        setSelectedId(undefined);
    };

    const onExerciseUpdate = (updateList: boolean) => {
        if (updateList) {
            exerciseListRef.current?.reload();
        }
    };

    return (
        <ModalRoot>
            <div className="w-screen h-screen">
                <Background className="p-3">
                    <Suspense>
                        <ThemeSwitch className="absolute right-3 bottom-3 shadow-md"/>
                    </Suspense>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center overflow-hidden">
                        <div
                            className="grow shrink-0 sm:max-w-[300px] rounded-md">
                            <ExerciseList ref={exerciseListRef}
                                          selectedId={selectedId}
                                          onExerciseSelected={setSelectedId}/>
                        </div>
                        <div className="grow min-h-[1px] max-w-[700px]">
                            <ExerciseEdit selectedId={selectedId}
                                          onExerciseRemove={onExerciseRemove}
                                          onExerciseUpdate={(prev, next) =>
                                              onExerciseUpdate(prev.title !== next.title)}/>
                        </div>
                    </div>
                </Background>
            </div>
        </ModalRoot>
    );
}
