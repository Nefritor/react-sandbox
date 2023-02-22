import {useState} from 'react';

import {Range} from 'Components/slider';

export default function SliderDemo() {
    const [value, setValue] = useState(0);
    const [max, setMax] = useState(100);

    return (
        <div className='h-full w-full flex flex-col items-center justify-center'>
            <div
                className='h-[200px] w-[300px] bg-gray-200 rounded-xl flex flex-col py-3 px-5 gap-1 items-center shadow-md'>
                <div className=''>State: {value}</div>
                <Range value={value}
                       max={max}
                       onChange={setValue}/>
            </div>
        </div>
    );
}