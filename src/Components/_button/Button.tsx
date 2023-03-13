import clsx from 'clsx';

interface IButtonProps {
    className?: string;
    caption: string | JSX.Element;
    onClick: () => void;
}

export default function Button(props: IButtonProps) {
    const {onClick, caption} = props;
    return (
        <button className={clsx(
            'py-1 w-fit px-2 bg-blue-500 rounded text-white select-none',
            'hover:brightness-95 active:brightness-90 dark:text-gray-300 transition-colors',
            [props.className]
        )}
                onClick={onClick}>
            {caption}
        </button>
    )
}
