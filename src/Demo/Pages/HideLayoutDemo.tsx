import React, { useState } from 'react';

import { Switch } from 'Components/toggle';
import { Hide } from 'Components/layout';
import Block from 'Layout/Block';

export default function InputTextDemo(): JSX.Element {
    const [ isHidden, setIsHidden ] = useState(false);

    return <Block className="flex flex-col items-center gap-3 w-[150px]" shadow={true}>
        <div className="h-[50px] w-[50px]">
            <Hide isHidden={isHidden}
                  duration={300}>
                <div className="h-[50px] w-[50px] bg-gray-700 dark:bg-gray-200 cursor-pointer"/>
            </Hide>
        </div>
        <Switch value={isHidden}
                onChange={setIsHidden}/>
    </Block>;
}
