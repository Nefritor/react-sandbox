import clsx from 'clsx';

interface IProps<IElement> {
    list: IElement[];
    item: (data: IElement) => JSX.Element;
    itemClasName?: string;
    emptyView?: JSX.Element;
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

export default function View<IElement extends IListElement>(props: IProps<IElement>): JSX.Element {
    return (
        <div className='flex flex-col gap-0.5 bg-gray-400/20'>

            {
                props.list.length || !props.emptyView ?
                    props.list.map((element) =>
                        <ItemWrapper key={element.id}
                                     className={props.itemClasName}
                                     onClick={() => props.onElementClick(element)}>
                            {props.item(element)}
                        </ItemWrapper>) :
                    props.emptyView
            }
        </div>
    )
}

function ItemWrapper(props: IWrapper) {
    return (
        <div className={clsx(
            'px-3 hover:bg-transparent transition-[background-color] cursor-pointer',
            props.className
        )}
             title={props.title}
             onClick={() => props.onClick()}>
            {props.children}
        </div>
    )
}