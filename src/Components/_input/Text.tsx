import React, {RefObject, useEffect, useRef} from "react";
import clsx from 'clsx';

export interface IInputProps {
    placeholder?: string;
    absolutePlaceholder?: boolean;
    staticPlaceholder?: boolean;
    label?: string;
    value: string;
    background?: TBackground;
    inputClassName?: string;
    onInit?: (ref: RefObject<HTMLInputElement>) => void;
    onChange: (value: string) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onSubmit?: () => void;
    type?: TType;
    children?: JSX.Element;
}

type TBackground =
    | 'default'
    | 'contrast';

type TType =
    | 'text'
    | 'password';

const getBackgroundClass = (value?: TBackground) => {
    switch (value) {
        case 'contrast':
            return 'rounded-none bg-transparent border-b-2 border-gray-300 dark:border-gray-500';
        default:
            return 'rounded-md dark:bg-gray-600';
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
        <form className='flex grow items-center'
              onSubmit={(e) => {e.preventDefault(); props.onSubmit?.();}}>
            {
                props.label &&
                <div className='mr-3 shrink-0 text-zinc-500 dark:text-gray-400'>{props.label}</div>
            }
            <div className={clsx(
                getBackgroundClass(props.background),
                'dark:text-gray-400 relative flex',
                [props.inputClassName],
                {'mt-4': props.placeholder && !props.absolutePlaceholder && !props.staticPlaceholder}
            )}
                 onClick={() => inputRef.current?.focus()}>
                {
                    props.placeholder && (!props.staticPlaceholder || !props.value) &&
                    <div
                        className={`absolute px-2 ${props.value ? 'top-[-1rem] text-xs text-zinc-500 dark:text-gray-400' : 'text-zinc-400 dark:text-gray-500 top-0'}`}
                        style={{
                            transition: 'top .15s ease, font-size .15s ease, color .15s ease'
                        }}>
                        {props.placeholder}
                    </div>
                }
                <input className={clsx(
                    'outline-none px-2 bg-transparent w-full'
                )}
                       ref={inputRef}
                       type={props.type || 'text'}
                       value={props.value}
                       onFocus={(e) => props.onFocus?.(e)}
                       onChange={(e) => props.onChange(e.target.value)}/>
                {
                    props.children
                }
            </div>
        </form>
    )
}