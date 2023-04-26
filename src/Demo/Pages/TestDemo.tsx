import React, {Suspense} from 'react';
import Block from 'Layout/Block';
import {ThemeSwitch} from 'Messenger/components';
import Background from 'Layout/Background';

export default function InputTextDemo(): JSX.Element {

    return (
        <Background className='items-center justify-center relative'>
            <Suspense>
                <ThemeSwitch className='absolute right-3 top-3 shadow-md'/>
            </Suspense>
            <Block shadow={true}>
                123
            </Block>
        </Background>
    )
}
