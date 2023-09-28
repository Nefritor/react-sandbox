import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

interface IProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: () => void;
    className?: string;
    inputClassName?: string;
    placeholderClassName?: string;
    filled?: boolean;
    placeholder?: string;
    staticPlaceholder?: boolean;
    label?: string;
    labelWidth?: number;
}

const Text = forwardRef((props: IProps, ref) => {
    const [ isFocus, setIsFocus ] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current);

    return (
        <div className={clsx(
            'flex items-baseline',
            { 'mt-5': props.placeholder && !props.staticPlaceholder },
            [ props.className ])
        }>
            {
                props.label &&
                <div className="mr-3 text-gray-600 select-none text-crop whitespace-nowrap dark:text-gray-400"
                     style={props.labelWidth ? { width: props.labelWidth } : undefined}
                     title={props.label}>
                    {props.label}
                </div>
            }
            <div className="flex items-center relative grow">
                {
                    props.placeholder && (!props.staticPlaceholder || !props.value) &&
                    <div className={clsx(
                        'absolute py-1 px-3 w-full transition-[transform,font-size]',
                        'text-gray-400 dark:text-gray-400/50 select-none',
                        'cursor-text text-crop whitespace-nowrap',
                        { '-translate-y-8 -translate-x-2 text-sm cursor-default': props.value },
                        { 'text-blue-400 dark:text-blue-400/100': isFocus && props.value },
                        props.placeholderClassName
                    )}
                         onMouseDown={(e) => {
                             e.preventDefault();
                             inputRef.current?.focus();
                         }}
                         title={props.placeholder}>
                        {props.placeholder}
                    </div>
                }
                <form className="flex grow w-full"
                      onSubmit={(e) => {
                          e.preventDefault();
                          props.onSubmit?.();
                      }}>
                    <input ref={inputRef} className={clsx(
                        'outline-none rounded-lg outline-spacing-0 dark:text-gray-400 border-gray-300',
                        'py-1 px-2 min-w-[1px] border-2 w-full',
                        'focus:border-blue-400 focus:dark:border-blue-400',
                        props.filled ?
                            'bg-gray-300 dark:bg-gray-600 dark:border-gray-600' :
                            'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 ',
                        [ props.inputClassName ]
                    )}
                           onFocus={() => setIsFocus(true)}
                           onBlur={() => setIsFocus(false)}
                           value={props.value}
                           onChange={(e) => props.onChange(e.target.value)}/>
                </form>
            </div>
        </div>
    );
});

export default Text;
