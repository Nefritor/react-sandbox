import React, { useState } from 'react';

import { Text } from 'Components/input';
import { Checkbox } from 'Components/toggle';
import Block from 'Layout/Block';

export default function InputTextDemo(): JSX.Element {
    const [ text, setText ] = useState('');
    const [ placeholder, setPlaceholder ] = useState('');
    const [ label, setLabel ] = useState('');
    const [ isContrast, setIsContrast ] = useState(false);
    const [ isStaticPlaceholder, setIsStaticPlaceholder ] = useState(false);

    return <Block className="w-[400px] flex flex-col gap-3" shadow={true}>
        <Text value={text}
              onChange={setText}
              staticPlaceholder={isStaticPlaceholder}
              filled={isContrast}
              placeholder={placeholder}
              label={label}/>
        <Block className="flex flex-col gap-3">
            <Text label="Placeholder"
                  labelWidth={100}
                  value={placeholder}
                  onChange={setPlaceholder}/>
            <Text label="Label"
                  labelWidth={100}
                  value={label}
                  onChange={setLabel}/>
            <Checkbox label="Contrast background"
                      value={isContrast}
                      onChange={setIsContrast}/>
            <Checkbox label="Static placeholder"
                      value={isStaticPlaceholder}
                      onChange={setIsStaticPlaceholder}/>
        </Block>
    </Block>;
}
