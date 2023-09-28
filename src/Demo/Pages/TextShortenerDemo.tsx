import React, { useState } from 'react';

import { TextShortener } from 'Components/animate';
import { Switch } from 'Components/toggle';
import Block from 'Layout/Block';

export default function InputTextDemo(): JSX.Element {
    const [ isShort, setIsShort ] = useState(false);

    return <Block className="w-[120px] flex flex-col gap-3 items-center" shadow={true}>
        <div className="dark:text-gray-400">
            <TextShortener isShort={isShort}/>
        </div>
        <Switch value={isShort}
                onChange={setIsShort}/>
    </Block>;
}
