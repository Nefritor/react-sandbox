import { useCallback } from 'react';
import clsx from 'clsx';

interface IProps {
    className?: string;
    caption: string;
    title?: string;
    isChecked?: boolean;
    onCheckedChanged: (isChecked: boolean) => void;
}

export const Button = ({ className, caption, title, isChecked = false, onCheckedChanged }: IProps): JSX.Element => {
    const onClick = useCallback(() => {
        onCheckedChanged(!isChecked);
    }, [ isChecked, onCheckedChanged ]);

    return <div className={clsx('', { 'bg-black': isChecked }, className)}
                title={title}
                onClick={onClick}>
        {caption}
    </div>;
};
