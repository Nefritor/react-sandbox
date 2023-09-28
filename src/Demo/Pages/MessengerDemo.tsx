import { Suspense, useEffect, useState } from 'react';

import Uuid from 'react-uuid';

import { AES, enc } from 'crypto-ts';

import { Text } from 'Components/input';
import { MessagesList } from 'Messenger/components';
import { IMessage, Sender } from 'Messenger/interface';
import { Button } from 'Components/button';
import Block from 'Layout/Block';

export default function MessengerDemo(): JSX.Element {
    const [ secretSender, setSecretSender ] = useState('12345');
    const [ secretAddressee, setSecretAddressee ] = useState('12345');
    const [ hash, setHash ] = useState('');
    const [ messageSender, setMessageSender ] = useState('');
    const [ messageAddressee, setMessageAddressee ] = useState('');

    const [ secretLeft, setSecretLeft ] = useState('');
    const [ secretRight, setSecretRight ] = useState('');
    const [ textLeft, setTextLeft ] = useState('');
    const [ textRight, setTextRight ] = useState('');

    const [ messages, setMessages ] = useState<IMessage[]>([]);

    const addMessage = (message: IMessage) => {
        setMessages((messages) => [ ...messages, message ]);
    };

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
    };

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
    };

    useEffect(() => {
        setHash(AES.encrypt(messageSender, secretSender).toString());
    }, [ messageSender, secretSender ]);

    useEffect(() => {
        setMessageAddressee(AES.decrypt(hash, secretAddressee).toString(enc.Utf8));
    }, [ hash, secretAddressee ]);

    return (
        <Suspense>
            <Block className="flex flex-col gap-3 w-[800px] h-full my-20" shadow={true}>
                <Block className="flex flex-col gap-2">
                    <Text value={secretSender}
                          placeholder="Secret sender"
                          onChange={setSecretSender}/>
                    <Text value={messageSender}
                          placeholder="Message"
                          onChange={setMessageSender}/>
                </Block>
                <Block>
                    <span className="text-gray-500 dark:text-gray-400">Hash:</span>
                    &nbsp;
                    <span className="text-blue-500 dark:text-blue-400">{hash}</span>
                </Block>
                <Block className="flex flex-col gap-2">
                    <Text value={secretAddressee}
                          placeholder="Secret receiver"
                          onChange={setSecretAddressee}/>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">Decrypted:</span>
                        &nbsp;
                        <span className="text-blue-500 dark:text-blue-400">{messageAddressee}</span>
                    </div>
                </Block>
                <div className="flex gap-3">
                    <Block className="flex flex-col grow gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Left user</div>
                        <Text value={secretLeft}
                              placeholder="Secret"
                              onChange={setSecretLeft}/>
                        <Text value={textLeft}
                              placeholder="Message"
                              onChange={setTextLeft}/>
                        <Button caption="Отправить"
                                onClick={sendLeft}/>
                    </Block>
                    <Block className="flex flex-col grow gap-2">
                        <div className="text-gray-500 dark:text-gray-400">Right user</div>
                        <Text value={secretRight}
                              placeholder="Secret"
                              onChange={setSecretRight}/>
                        <Text value={textRight}
                              placeholder="Message"
                              onChange={setTextRight}/>
                        <Button caption="Отправить"
                                onClick={sendRight}/>
                    </Block>
                </div>
                <Block className="flex flex-col grow min-h-0 py-2 px-3 overflow-scroll scrollbar-thin h-0">
                    <div className="grow">
                        <MessagesList list={messages}/>
                    </div>
                </Block>
            </Block>
        </Suspense>
    );
}
