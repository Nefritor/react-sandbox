import React, { useState } from 'react';
import Block from 'Layout/Block';
import { Button } from 'Components/button';

export default function InputTextDemo(): JSX.Element {
    const [ count, setCount ] = useState(0);
    return <Block className="flex flex-col gap-3 items-center w-[300px]" shadow={true}>
        <div className="text-gray-700 dark:text-gray-400">{count}</div>
        <Button
            caption="Нажми меня"
            onClick={() => setCount((x) => ++x)}/>
    </Block>;
}
