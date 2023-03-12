interface IButtonProps {
    className?: string;
    caption: string | JSX.Element;
    onClick: () => void;
}

export default function Button(props: IButtonProps) {
    const {onClick, caption} = props;
    return (
        <button className={`py-1 w-fit px-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-300 active:bg-blue-700 text-white dark:text-gray-300 ${props.className}`}
                onClick={onClick}>
            {caption}
        </button>
    )
}