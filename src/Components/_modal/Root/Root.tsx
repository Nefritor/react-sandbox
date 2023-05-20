import {ReactElement, useCallback, useState} from 'react';
import clsx from 'clsx';

import Block from 'Layout/Block';

import {ModalContext} from '../Context/Context';

interface IProps {
    children: ReactElement;
}

export const Root = (props: IProps): JSX.Element => {
    const [window, setWindow] = useState<JSX.Element | null>(null);

    const closeWindow = useCallback(() => setWindow(null), []);

    return (
        <>
            {
                window &&
                <div className='absolute w-screen h-screen z-50'
                     onClick={() => !!window && closeWindow()}>
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                         onClick={(e) => e.stopPropagation()}>
                        <Block>
                            {window}
                        </Block>
                    </div>
                </div>
            }
            <ModalContext.Provider value={setWindow}>
                <div className={clsx({'brightness-50': !!window})}>
                    {props.children}
                </div>
            </ModalContext.Provider>
        </>
    )
}
