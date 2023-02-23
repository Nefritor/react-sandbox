import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import clsx from 'clsx';

import {Edge, ILayer, TDirection} from 'Components/popup';
import {Switch} from 'Components/toggle';
import {Button} from 'Components/button';

export default function PopupEdgeDemo() {
    const [visibilityTop, setVisibilityTop] = useState(false);
    const [topValue, setTopValue] = useState('lol');
    const [visibilityRight, setVisibilityRight] = useState(false);
    const [rightValue, setRightValue] = useState('lol');
    const [visibilityLeft, setVisibilityLeft] = useState(false);
    const [leftValue, setLeftValue] = useState('lol');
    const [visibilityBottom, setVisibilityBottom] = useState(false);
    const [bottomValue, setBottomValue] = useState('lol');
    const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

    const getLayers = (): ILayer[] => {
        return [{
            key: 'lol',
            content: <div className='w-[100px] h-[100px] bg-amber-500'>lol</div>
        }, {
            key: 'kek',
            content: <div className='w-[100px] h-[100px] bg-pink-500'>kek</div>
        }]
    }

    useEffect(() => {
        const HTMLClassList = document.documentElement.classList;
        const isDarkMode = HTMLClassList.contains('dark');
        if (darkMode && !isDarkMode) {
            HTMLClassList.add('dark');
        } else if (!darkMode && isDarkMode) {
            HTMLClassList.remove('dark');
        }
    }, [darkMode]);

    const getDemoBlock = (direction: TDirection) => {
        const config = {} as {
            isVertical: boolean,
            isVerse: boolean,
            visibility: boolean,
            setVisibility: Dispatch<SetStateAction<boolean>>
            value: string,
            setValue: Dispatch<SetStateAction<string>>,
        };
        switch (direction) {
            case 'top':
                config.isVertical = true;
                config.isVerse = true;
                config.visibility = visibilityTop;
                config.setVisibility = setVisibilityTop;
                config.value = topValue;
                config.setValue = setTopValue;
                break;
            case 'right':
                config.isVertical = false;
                config.isVerse = false;
                config.visibility = visibilityRight;
                config.setVisibility = setVisibilityRight;
                config.value = rightValue;
                config.setValue = setRightValue;
                break;
            case 'bottom':
                config.isVertical = true;
                config.isVerse = false;
                config.visibility = visibilityBottom;
                config.setVisibility = setVisibilityBottom;
                config.value = bottomValue;
                config.setValue = setBottomValue;
                break;
            case 'left':
                config.isVertical = false;
                config.isVerse = true;
                config.visibility = visibilityLeft;
                config.setVisibility = setVisibilityLeft;
                config.value = leftValue;
                config.setValue = setLeftValue;
                break;
        }

        const getButtons = () =>
            <div className={config.isVertical ? 'flex gap-1' : 'flex flex-col gap-1'}>
                <Button onClick={() => config.setVisibility((prev) => !prev)}
                        caption={!config.visibility ? 'Show' : 'Hide'}/>
                <Button onClick={() => config.setValue((prev) => prev === 'lol' ? 'kek' : 'lol')}
                        caption='Change layer'/>
            </div>

        const getPopup = () =>
            <div className={config.isVertical ? 'flex flex-col' : 'h-[100px]'}>
                <Edge layers={getLayers()}
                      value={config.visibility ? config.value : null}
                      size={100}
                      direction={direction}/>
            </div>

        return (
            <div className={
                clsx(
                    'flex',
                    'flex-col',
                    'border-2',
                    'border-gray-200',
                    'dark:border-gray-600',
                    'rounded-xl',
                    'p-3',
                    'gap-1',
                    'w-[200px]',
                    'flex-grow'
                )
            }>
                <span className='text-xl dark:text-gray-400'>Direction: {direction}</span>
                <div className={clsx('flex', {'flex-col': config.isVertical})}>
                    {config.isVerse ? <>{getPopup()} {getButtons()}</> : <>{getButtons()} {getPopup()}</>}
                </div>
            </div>
        )
    }

    return (
        <div className={
            clsx(
                'h-screen',
                'w-screen',
                'flex',
                'flex-col',
                'p-7',
                'dark:bg-gray-900'
            )
        }>
            <div className='p-3 flex items-center gap-2'>
                <span className='dark:text-gray-400'>Dark mode</span>
                <Switch value={darkMode}
                        onChange={() => setDarkMode((prev) => !prev)}/>
            </div>
            <div className={
                clsx(
                    'h-[500px]',
                    'w-[500px]',
                    'bg-gray-100',
                    'dark:bg-gray-700',
                    'rounded-xl',
                    'p-3',
                    'shadow-md'
                )
            }>
                <div className='dark:text-gray-400 text-3xl text-center mb-3'>
                    Component demo: PopupEdge
                </div>
                <div className='flex gap-3 flex-wrap'>
                    {getDemoBlock('top')}
                    {getDemoBlock('right')}
                    {getDemoBlock('bottom')}
                    {getDemoBlock('left')}
                </div>
            </div>
        </div>
    );
}