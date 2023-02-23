import {useState} from 'react';

import {Switch} from 'Components/toggle';

export default function SwitchDemo(): JSX.Element {
    const [value, setValue] = useState(false);

    return (
        <div className='h-full w-full flex flex-col items-center justify-center dark:bg-gray-900'>
            <div className='h-[200px] w-[300px] bg-gray-200 rounded-xl flex flex-col py-3 px-5 gap-1 items-center shadow-md dark:bg-gray-700'>
                <div className='dark:text-gray-400'>State: {value ? 'true' : 'false'}</div>
                <Switch value={value}
                        onChange={setValue}/>
            </div>
        </div>
    )
}