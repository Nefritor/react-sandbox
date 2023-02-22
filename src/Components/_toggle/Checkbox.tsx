import React, {useRef} from 'react';

interface ICheckboxProps {
    label?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export default function Checkbox(props: ICheckboxProps) {
    return (
        <div className='flex items-baseline cursor-pointer select-none'
             onClick={() => props.onChange(!props.value)}>
            <input type='checkbox'
                   checked={props.value}
                   readOnly={true}/>
            {
                props.label &&
                <div className='ml-3'>{props.label}</div>
            }
        </div>
    )
}