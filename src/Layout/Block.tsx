import { CSSProperties, forwardRef, LegacyRef, MouseEventHandler, ReactNode } from 'react';

import clsx from 'clsx';

interface IProps {
    className?: string;
    shadow?: boolean;
    hasPadding?: boolean;
    hasBackground?: boolean;
    hasBorder?: boolean;
    style?: CSSProperties;
    onClick?: MouseEventHandler<HTMLDivElement>;
    children: ReactNode;
}

const Block = forwardRef((
    {
        className,
        children,
        shadow,
        hasPadding = true,
        hasBackground = true,
        hasBorder = true,
        onClick,
        style
    }: IProps,
    ref: LegacyRef<HTMLDivElement>): JSX.Element => {
    return (
        <div ref={ref}
             className={clsx(
                 'rounded-lg',
                 [ className ],
                 {
                     'shadow-md': shadow,
                     'p-3': hasPadding,
                     'bg-gray-200 dark:bg-gray-700': hasBackground,
                     'border-2 border-gray-300 dark:border-gray-600': hasBorder
                 }
             )}
             style={style}
             onClick={onClick}>
            {children}
        </div>
    );
});

export default Block;
