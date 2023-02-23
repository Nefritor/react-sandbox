import React, {useState} from 'react';

import {Text} from 'Components/input';
import {Checkbox} from 'Components/toggle';

export default function InputTextDemo(): JSX.Element {
    const [text, setText] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [label, setLabel] = useState('');
    const [isContrast, setIsContrast] = useState(false);

    return (
        <div className='h-full w-full flex flex-col items-center justify-center overflow-hidden relative dark:bg-gray-900'>
            <div className='w-[400px] bg-gray-200 rounded-xl flex flex-col py-3 px-5 gap-1 shadow-md dark:bg-gray-700'>
                <Text placeholder={placeholder}
                      label={label}
                      value={text}
                      background={isContrast ? 'contrast' : 'default'}
                      onChange={setText}/>
                <div className='flex flex-col gap-2 m-1 p-3 border-2 border-gray-300 rounded-md'>
                    <Text label='Placeholder'
                          value={placeholder}
                          onChange={setPlaceholder}/>
                    <Text label='Label'
                          value={label}
                          onChange={setLabel}/>
                    <Checkbox label='Contrast background'
                              value={isContrast}
                              onChange={setIsContrast}/>
                </div>
            </div>
        </div>
    )
}