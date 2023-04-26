import {RiHomeLine} from 'react-icons/ri';
import clsx from 'clsx';

interface INavigationItem {
    key: string;
    caption: string;
    shortCaption: string;
}

interface ISideProps {
    selectedKey: string | null;
    items: INavigationItem[];
    onItemClick: (key: string | null) => void;
}

export default function Navigation(props: ISideProps): JSX.Element {
    return (
        <div className='flex
                        absolute
                        justify-center
                        w-full
                        bottom-0'>
            <div className='flex
                            cursor-pointer
                            rounded-xl
                            items-center
                            overflow-hidden
                            select-none
                            leading-none
                            mb-3
                            mx-3'>
                <div
                    className={clsx('p-3 hover:brightness-95 transition-[filter]', props.selectedKey === null ? 'bg-gray-500 text-white' : 'bg-gray-300')}
                    onClick={() => props.onItemClick(null)}>
                    <RiHomeLine/>
                </div>
                <div className='flex
                                overflow-x-auto
                                scrollbar-none'>
                    {
                        props.items.map((item: INavigationItem) => (
                            <div key={item.key}
                                 className={clsx(
                                     'p-3 hover:brightness-95 transition-[filter]',
                                     item.key === props.selectedKey ? 'bg-gray-500 text-white' : 'bg-gray-200'
                                 )}
                                 onClick={() => props.onItemClick(item.key)}>
                                {item.shortCaption}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
