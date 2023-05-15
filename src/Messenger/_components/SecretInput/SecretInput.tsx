import Copy from 'copy-to-clipboard';
import {MdContentCopy} from 'react-icons/md';

import {IInputProps, Text} from 'Components/input';

interface ISecretProps extends IInputProps {
    onCopy: () => void;
}

export default function SecretInput(props: ISecretProps): JSX.Element {
    const onCopyClick = () => {
        if (Copy(props.value)) {
            props.onCopy();
        }
    }

    const getButtons = () => (
        <div className='flex items-center px-1 gap-1'
             onClick={(event) => event.stopPropagation()}>
            <MdContentCopy className='cursor-pointer text-gray-400 hover:brightness-90'
                           onClick={onCopyClick}/>
        </div>
    )

    return (
        <Text {...props}>
            {
                getButtons()
            }
        </Text>
    )
}
