import clsx from 'clsx';

interface IProps<IElement> {
    list: IElement[];
    item: (data: IElement) => JSX.Element;
    itemClassName?: string;
    className?: string;
    emptyView?: JSX.Element;
    emptyText?: string;
    onElementClick: (data: IElement) => void;
}

interface IWrapper {
    onClick: () => void;
    className?: string;
    title?: string;
    children: JSX.Element;
}

export interface IListElement {
    id: string;
}

const getEmptyView = (emptyView?: JSX.Element, emptyText?: string) => (
    emptyView ||
    (
        emptyText &&
        <div className='flex min-h-[80px] items-center justify-center'>
            <div className='text-xl dark:text-gray-400'>
                {emptyText}
            </div>
        </div>
    )
)

export default function View<IElement extends IListElement>(props: IProps<IElement>): JSX.Element {
    return (
        <div className={clsx(
            'flex flex-col',
            [props.className]
        )}>

            {
                props.list.length ?
                    props.list.map((element) =>
                        <ItemWrapper key={element.id}
                                     className={props.itemClassName}
                                     onClick={() => props.onElementClick(element)}>
                            {props.item(element)}
                        </ItemWrapper>) :
                    getEmptyView(props.emptyView, props.emptyText)
            }
        </div>
    )
}

function ItemWrapper(props: IWrapper) {
    return (
        <div className={clsx(
            'bg-gray-200 dark:bg-gray-700 dark:hover:brightness-110 hover:brightness-95',
            'cursor-pointer text-black dark:text-gray-400',
            [props.className]
        )}
             title={props.title}
             onClick={() => props.onClick()}>
            {props.children}
        </div>
    )
}
