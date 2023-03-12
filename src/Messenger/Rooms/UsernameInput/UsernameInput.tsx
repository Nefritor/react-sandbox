import React, {useState} from 'react';
import {MdCheck, MdEdit} from 'react-icons/md';
import {GrRevert} from 'react-icons/gr';

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
                              inputClassName='w-[200px] bg-gray-300 shadow-md h-8'
                              onInit={(ref) => ref.current?.focus()}
                              onChange={setInputValue}>
                            <Button caption={<MdCheck size={20}/>}
                                    className='bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
                                    onClick={onConfirm}/>
                        </Text>
                        {
                            inputValue !== props.value &&
                            <GrRevert className='absolute -right-3 translate-x-full cursor-pointer'
                                      size={20}
                                      onClick={() => setIsEdit(false)}/>
                        }
                    </div>
                    :
                    <div className='flex
                                    items-center
                                    cursor-pointer
                                    text-gray-500
                                    text-lg
                                    hover:text-gray-400
                                    leading-8
                                    transition-[color]'
                         onClick={onEdit}>
                        <span>{props.value}</span>
                        &nbsp;
                        <MdEdit/>
                    </div>
            }
        </>
    )
}