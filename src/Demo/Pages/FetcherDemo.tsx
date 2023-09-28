import React, { useState } from 'react';

import { Button } from 'Components/button';
import { useFetcher } from 'Components/hooks';
import { Text } from 'Components/input';
import { Checkbox } from 'Components/toggle';
import Block from 'Layout/Block';

export default function FetcherDemo(): JSX.Element {
    const [ fetch, Fetcher ] = useFetcher();
    const [ fetcherCaption, setFetcherCaption ] = useState('Загрузка');
    const [ fetcherTitle, setFetcherTitle ] = useState('Тестовая загрузка');
    const [ fetcherDuration, setFetcherDuration ] = useState(5);
    const [ isFailed, setIsFailed ] = useState(false);

    const buttonClick = () => {
        fetch({
            title: fetcherTitle,
            config: {
                loading: {
                    caption: fetcherCaption
                },
                success: {
                    caption: 'Успешно',
                    duration: 3000
                },
                fail: {
                    caption: 'Ошибка',
                    duration: 3000
                }
            },
            onClick: () => {
                console.log('Уведомление закрыто');
            },
            promise: new Promise((resolve, reject) => {
                setTimeout(() => {
                    isFailed ? reject() : resolve();
                }, fetcherDuration * 1000);
            })
        });
    };

    return (
        <>
            <Block className="flex flex-col items-center gap-2" shadow={true}>
                <div className="flex align-baseline">
                    <Text
                        placeholder="Название уведомления"
                        value={fetcherTitle}
                        onChange={setFetcherTitle}/>
                </div>
                <div className="flex align-baseline">
                    <Text
                        placeholder="Текст уведомления"
                        value={fetcherCaption}
                        onChange={setFetcherCaption}/>
                </div>
                <div className="flex align-baseline">
                    <Text
                        placeholder="Длительность задержки (сек)"
                        value={fetcherDuration.toString()}
                        onChange={(value) => {
                            const number = +value;
                            if (isFinite(number)) {
                                setFetcherDuration(number);
                            }
                        }}/>
                </div>
                <div className="flex align-baseline">
                    <Checkbox label="Завершить с ошибкой"
                              value={isFailed}
                              onChange={setIsFailed}/>
                </div>
                <Button caption="Fetch Data"
                        onClick={buttonClick}/>
            </Block>
            <Fetcher/>
        </>
    );
}
