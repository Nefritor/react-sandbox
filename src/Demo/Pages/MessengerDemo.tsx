import {useEffect, useState} from 'react';

import Uuid from 'react-uuid';

import {AES, enc} from 'crypto-ts';

import {Text} from 'Components/input';
import {MessagesList} from 'Messenger/components';
import {IMessage, Sender} from 'Messenger/interface';
import {Button} from 'Components/button';

export default function MessengerDemo(): JSX.Element {
    const [secretSender, setSecretSender] = useState('12345');
    const [secretAddressee, setSecretAddressee] = useState('12345');
    const [hash, setHash] = useState('');
    const [messageSender, setMessageSender] = useState('');
    const [messageAddressee, setMessageAddressee] = useState('');

    const [secretLeft, setSecretLeft] = useState('');
    const [secretRight, setSecretRight] = useState('');
    const [textLeft, setTextLeft] = useState('');
    const [textRight, setTextRight] = useState('');

    const [messages, setMessages] = useState<IMessage[]>([]);

    const addMessage = (message: IMessage) => {
        setMessages((messages) => [...messages, message]);
    }

    const sendLeft = () => {
        const decrypted = AES.decrypt(AES.encrypt(textLeft, secretLeft).toString(), secretRight).toString(enc.Utf8);
        addMessage({
            id: Uuid(),
            sender: Sender.OUT,
            senderName: 'Left user',
            text: decrypted || '[encrypted]',
            date: Date.now(),
            style: decrypted ? 'default' : 'error'
        });
        setTextLeft('');
    }

    const sendRight = () => {
        const decrypted = AES.decrypt(AES.encrypt(textRight, secretRight).toString(), secretLeft).toString(enc.Utf8);
        addMessage({
            id: Uuid(),
            sender: Sender.IN,
            senderName: 'Right user',
            text: decrypted || '[encrypted]',
            date: Date.now(),
            style: decrypted ? 'default' : 'error'
        });
        setTextRight('');
    }

    useEffect(() => {
        setHash(AES.encrypt(messageSender, secretSender).toString());
    }, [messageSender, secretSender])

    useEffect(() => {
        setMessageAddressee(AES.decrypt(hash, secretAddressee).toString(enc.Utf8));
    }, [hash, secretAddressee])

    return (
        <div className='flex flex-col h-screen w-screen items-center justify-center gap-3'>
            <div className='bg-gray-300 rounded-xl p-3 shadow-md'>
                <Text value={secretSender} placeholder='Secret sender' onChange={setSecretSender}/>
                <Text value={messageSender} placeholder='Message' onChange={setMessageSender}/>
            </div>
            <div className='bg-gray-300 rounded-xl py-2 px-3 shadow-md'>
                <span className='text-gray-500'>Hash:</span>
                &nbsp;
                <span>{hash}</span>
            </div>
            <div className='bg-gray-300 rounded-xl py-2 px-3 shadow-md'>
                <Text value={secretAddressee} placeholder='Secret receiver' onChange={setSecretAddressee}/>
                <span className='text-gray-500'>Decrypted:</span>
                &nbsp;
                <span>{messageAddressee}</span>
            </div>
            <div className='flex w-[500px] gap-3'>
                <div className='flex flex-col items-center grow bg-gray-300 rounded-xl py-2 px-3 gap-2 shadow-md'>
                    <div>Left user</div>
                    <Text value={secretLeft} placeholder='Secret' onChange={setSecretLeft}/>
                    <Text value={textLeft} placeholder='Message' onChange={setTextLeft}/>
                    <Button caption='Отправить' onClick={sendLeft}/>
                </div>
                <div className='flex flex-col items-center grow bg-gray-300 rounded-xl py-2 px-3 gap-2 shadow-md'>
                    <div>Right user</div>
                    <Text value={secretRight} placeholder='Secret' onChange={setSecretRight}/>
                    <Text value={textRight} placeholder='Message' onChange={setTextRight}/>
                    <Button caption='Отправить' onClick={sendRight}/>
                </div>
            </div>
            <div className='w-[500px] bg-gray-300 rounded-xl py-2 px-3 shadow-md'>
                <MessagesList list={messages}/>
            </div>
        </div>
    )
}
