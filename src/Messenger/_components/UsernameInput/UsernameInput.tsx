import React, {useState} from 'react';
import {MdCheck, MdEdit} from 'react-icons/md';
import {RxReset} from 'react-icons/rx';

import {Button} from 'Components/button';
import {Text} from 'Components/input';

interface IProps {
    value: string;
    onChange: (value: string) => void;
    onError: () => void;
}

export default function UsernameInput(props: IProps): JSX.Element {
    const [inputValue, setInputValue] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    const onConfirm = () => {
        if (inputValue) {
            props.onChange(inputValue);
            setIsEdit(false);
        } else {
            props.onError();
        }
    }

    const onEdit = () => {
        setInputValue(props.value);
        setIsEdit(true);
    }

    return (
        <>
            {
                isEdit ?
                    <div className='flex gap-3 relative items-center'>
                        <Text value={inputValue}
                              className='w-[200px] bg-gray-300 dark:bg-gray-700 shadow-md h-8 transition-colors'
                              onInit={(ref) => ref.current?.focus()}
                              onChange={setInputValue}>
                            <Button caption={<MdCheck className='text-white dark:text-gray-900 transition-colors' size={20}/>}
                                    className='bg-gray-700 hover:brightness-95 active:brightness-90 dark:bg-gray-500 transition-colors'
                                    onClick={onConfirm}/>
                        </Text>
                        {
                            inputValue !== props.value &&
                            <RxReset className='absolute -right-3 translate-x-full cursor-pointer text-gray-700 dark:text-gray-300 transition-colors'
                                      onClick={() => setIsEdit(false)}/>
                        }
                    </div>
                    :
                    <div className='flex
                                    items-center
                                    cursor-pointer
                                    text-gray-500
                                    dark:text-gray-400
                                    hover:brightness-95
                                    text-lg
                                    active:brightness-90
                                    leading-8
                                    transition-colors
                                    select-none'
                         onClick={onEdit}>
                        <span>{props.value}</span>
                        &nbsp;
                        <MdEdit/>
                    </div>
            }
        </>
    )
}