import React, {CSSProperties, ReactNode} from 'react';

import clsx from 'clsx';

interface IProps {
    className?: string;
    shadow?: boolean;
    hasPadding?: boolean;
    hasBackground?: boolean;
    hasBorder?: boolean;
    style?: CSSProperties;
    children: ReactNode;
}

export default function Block(
    {
        className,
        children,
        shadow,
        hasPadding = true,
        hasBackground = true,
        hasBorder = true,
        style
    }: IProps): JSX.Element {
    return (
        <div className={clsx(
            'rounded-lg',
            [className],
            {
                'shadow-md': shadow,
                'p-3': hasPadding,
                'bg-gray-200 dark:bg-gray-700': hasBackground,
                'border-2 border-gray-300 dark:border-gray-600': hasBorder
            }
        )}
             style={style}>
            {children}
        </div>
    )
}
