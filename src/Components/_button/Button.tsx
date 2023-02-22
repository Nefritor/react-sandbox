interface IButtonProps {
    className?: string;
    caption: string;
    onClick: () => void;
}

export default function Button(props: IButtonProps) {
    const {onClick, caption} = props;
    return (
        <button className={`py-1 w-fit px-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-300 active:bg-blue-700 text-white ${props.className}`}
                onClick={onClick}>
            {caption}
        </button>
    )
}