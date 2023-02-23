import {Ref, useEffect, useRef} from "react";

interface IInputProps {
    placeholder?: string;
    label?: string;
    value: string;
    background?: TBackground;
    onInit?: (ref: Ref<HTMLInputElement>) => void;
    onChange: (value: string) => void;
}

type TBackground =
    | 'default'
    | 'contrast';

const getBackgroundClass = (value?: TBackground) => {
    switch (value) {
        case 'contrast':
            return 'rounded-none bg-transparent border-b-2 border-gray-300 dark:border-gray-500';
        default:
            return 'rounded-md shadow-sm dark:bg-gray-600';
    }
}

export default function Text(props: IInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.onInit) {
            props.onInit(inputRef);
        }
    }, [inputRef]);

    return (
        <div className='flex items-baseline'>
            {
                props.label &&
                <div className='mr-3 text-zinc-500 dark:text-gray-400'>{props.label}</div>
            }
            <div className={`relative ${props.placeholder ? 'mt-4' : ''}`}
                 onClick={() => inputRef.current?.focus()}>
                {
                    props.placeholder &&
                    <div
                        className={`absolute px-2 ${props.value ? 'top-[-1rem] text-xs text-zinc-500 dark:text-gray-400' : 'text-zinc-400 dark:text-gray-500 top-0'}`}
                        style={{
                            transition: 'top .15s ease, font-size .15s ease, color .15s ease'
                        }}>
                        {props.placeholder}
                    </div>
                }
                <input className={`outline-none px-2 dark:text-gray-400 ${getBackgroundClass(props.background)}`}
                       ref={inputRef}
                       type="text"
                       value={props.value}
                       onChange={(e) => props.onChange(e.target.value)}/>
            </div>
        </div>
    )
}