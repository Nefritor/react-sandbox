import { useState } from 'react';

import { Switch } from 'Components/toggle';
import Block from 'Layout/Block';

export default function SwitchDemo(): JSX.Element {
    const [ value, setValue ] = useState(false);

    return <Block className="flex flex-col items-center gap-3 w-[200px]" shadow={true}>
        <div className="dark:text-gray-400">State: {value ? 'true' : 'false'}</div>
        <Switch value={value}
                onChange={setValue}/>
        <div className="text-xs text-blue-500 dark:text-blue-400 flex flex-col items-center">
            <span>Point is draggable</span>
            <span>Point is clickable</span>
        </div>
    </Block>;
}
