import clsx from 'clsx';
import { MouseEventHandler, useCallback } from 'react';

interface IProps {
    className?: string;
    caption: string | JSX.Element;
    isActive?: boolean;
    isContrast?: boolean;
    viewStyle?: TViewStyle;
    roundStyle?: TRoundType;
    size?: TSize;
    onClick: MouseEventHandler<HTMLDivElement>;
}

type TViewStyle =
    | 'default'
    | 'transparent'
    | 'outlined';

type TRoundType =
    | 'default'
    | 'full';

type TSize =
    | 'small'
    | 'medium'
    | 'large';

export default function Button(props: IProps): JSX.Element {
    const {
        className,
        caption,
        isActive = false,
        isContrast = false,
        viewStyle = 'default',
        roundStyle = 'default',
        size = 'medium',
        onClick
    } = props;

    const getClassName = useCallback(() => {
        return clsx(
            'px-2 truncate select-none cursor-pointer text-center text-gray-700 dark:text-gray-400',
            getViewClass(viewStyle, isContrast),
            getRoundClass(roundStyle),
            getSizeClass(size),
            getActiveClass(isActive),
            className
        );
    }, [ className, isActive, isContrast, roundStyle, size, viewStyle ]);

    return <div
        className={getClassName()}
        onClick={onClick}>
        {caption}
    </div>;
}

const getViewClass = (viewStyle: TViewStyle, isContrast: boolean) => {
    switch (viewStyle) {
        case 'transparent':
        case 'outlined':
            return clsx(
                { 'outline outline-2 outline-gray-400 dark:outline-gray-500': viewStyle === 'outlined' },
                isContrast
                    ? clsx(
                        'hover:backdrop-brightness-[1.04] active:backdrop-brightness-[1.06]',
                        'dark:hover:backdrop-brightness-[1.1] dark:active:backdrop-brightness-[1.2]',
                    )
                    : clsx(
                        'hover:backdrop-brightness-[.93] active:backdrop-brightness-[.9]',
                        'dark:hover:backdrop-brightness-[.93] dark:active:backdrop-brightness-[.87]'
                    )
            );
        default:
            return isContrast
                ? clsx(
                    'backdrop-brightness-[1.06] hover:backdrop-brightness-[1.08] active:backdrop-brightness-[1.1]',
                    'dark:backdrop-brightness-[1.2] dark:hover:backdrop-brightness-[1.25] dark:active:backdrop-brightness-[1.3]',
                )
                : clsx(
                    'backdrop-brightness-[.9] hover:backdrop-brightness-[.87] active:backdrop-brightness-[.84]',
                    'dark:backdrop-brightness-[.8] dark:hover:backdrop-brightness-[.7] dark:active:backdrop-brightness-[.6]'
                );
    }
};

const getRoundClass = (roundType: TRoundType) => {
    switch (roundType) {
        case 'full':
            return 'rounded-full';
        default:
            return 'rounded-lg';
    }
};

const getSizeClass = (size: TSize) => {
    switch (size) {
        case 'small':
            return 'leading-6 text-sm';
        case 'large':
            return 'leading-10 text-lg';
        default:
            return 'leading-8 text-md';
    }
};

const getActiveClass = (isActive: boolean) => {
    return '';
};
