import { Button } from 'Components/chips';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

interface IProps<IItem> {
    className?: string;
    keyProperty?: string;
    titleProperty?: string;
    selectedKey?: string;
    items: IItem[];
    onSelectedKeyChanged?: (key: string) => void;
    onSelectedItemChanged?: (item: IItem) => void;
}

type IDefaultItem = Record<string, any>;

export const Selector = <TItem extends IDefaultItem>(
    {
        className,
        keyProperty = 'key',
        titleProperty = 'title',
        selectedKey,
        items = [],
        onSelectedKeyChanged,
        onSelectedItemChanged
    }: IProps<TItem>
): JSX.Element => {
    const [ selectedKeyState, setSelectedKeyState ] = useState(selectedKey);

    const onCheckedChanged = useCallback((item: TItem, isChecked: boolean) => {
        if (isChecked) {
            setSelectedKeyState(item[keyProperty] as string);
        }
    }, [ keyProperty ]);

    useEffect(() => {
        if (selectedKeyState) {
            onSelectedKeyChanged?.(selectedKeyState);
            if (onSelectedItemChanged) {
                const selectedItem = items.find((item) => item[keyProperty] === selectedKeyState);
                if (selectedItem) {
                    onSelectedItemChanged(selectedItem);
                }
            }
        }
    }, [ items, keyProperty, onSelectedItemChanged, onSelectedKeyChanged, selectedKeyState ]);

    return <div className={clsx('flex flex-col gap-1', className)}>
        {
            items.map((item) =>
                <Button key={item[keyProperty] as string}
                        caption={item[titleProperty] as string}
                        isChecked={item[keyProperty] === selectedKeyState}
                        onCheckedChanged={onCheckedChanged.bind(this, item)}/>
            )
        }
    </div>;
};
