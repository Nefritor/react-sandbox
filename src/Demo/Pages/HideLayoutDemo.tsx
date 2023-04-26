import React, {useState} from 'react';

import {Switch} from 'Components/toggle';
import {Hide} from 'Components/layout';
import clsx from 'clsx';

export default function InputTextDemo(): JSX.Element {
    const [isHidden, setIsHidden] = useState(false);

    return (
        <div className={clsx(
            'h-full w-full flex flex-col items-center justify-center overflow-hidden relative dark:bg-gray-900'
        )}>
            <div className={clsx(
                'w-[150px] h-[150px] bg-gray-200 rounded-xl flex flex-col py-3 px-5 gap-1 shadow-md dark:bg-gray-700'
            )}>
                <div className='h-[50px] w-[50px]'>
                    <Hide isHidden={isHidden}
                          duration={300}>
                        <div className='h-[50px] w-[50px] bg-gray-700 cursor-pointer'/>
                    </Hide>
                </div>
                <Switch value={isHidden}
                        onChange={setIsHidden}/>
            </div>
        </div>
    )
}
