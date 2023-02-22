import React, {useState} from 'react';

import {TextShortener} from 'Components/animate';
import {Switch} from 'Components/toggle';

export default function InputTextDemo(): JSX.Element {
    const [isShort, setIsShort] = useState(false);

    return (
        <div className='h-full w-full flex flex-col items-center justify-center overflow-hidden relative'>
            <div className='w-[400px] bg-gray-200 rounded-xl flex flex-col py-3 px-5 gap-1 shadow-md'>
                <div>
                    <TextShortener isShort={isShort}/>
                </div>
                <Switch value={isShort}
                        onChange={setIsShort}/>
            </div>
        </div>
    )
}