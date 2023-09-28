import { useState } from 'react';

import { Range } from 'Components/slider';
import Block from 'Layout/Block';

export default function SliderDemo() {
    const [ value, setValue ] = useState(0);
    const [ max, setMax ] = useState(100);

    return <Block className="w-[250px] flex flex-col items-center gap-3" shadow={true}>
        <div className="dark:text-gray-400">State: {value}</div>
        <Range value={value}
               max={max}
               onChange={setValue}/>
    </Block>;
}
