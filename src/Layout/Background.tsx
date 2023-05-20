import React, {ReactNode} from 'react';

import clsx from 'clsx';

interface IProps {
    className?: string;
    children: ReactNode;
}

export default function Background({className, children}: IProps): JSX.Element {
    return (
        <div className={clsx(
            'h-full w-full flex flex-col overflow-hidden bg-white dark:bg-gray-900',
            [className]
        )}>
            {children}
        </div>
    )
}
