import { useState } from 'react';

import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RiHomeLine } from 'react-icons/ri';

interface ISideItems {
    key: string;
    caption: string;
    shortCaption: string;
}

interface ISideProps {
    title: string;
    items: ISideItems[];
    onItemClick: (key: string | null) => void;
}

export default function Side(props: ISideProps): JSX.Element {
    const [ isExtended, setIsExtended ] = useState(false);

    return (
        <div className="p-[5px]
                        shrink-0
                        w-[300px]
                        dark:bg-gray-800
                        dark:text-gray-400
                        bg-gray-200
                        flex
                        flex-col"
             style={{
                 width: isExtended ? 300 : 50,
                 transition: 'width .3s ease'
             }}>
            <div className="flex
                            items-center
                            justify-center
                            relative
                            h-[34px]
                            my-2
                            text-xl
                            text-center
                            cursor-pointer"
                 onClick={() => props.onItemClick(null)}>
                <RiHomeLine className="m-[4px] absolute transition-opacity duration-300"
                            style={{
                                opacity: isExtended ? 0 : 1
                            }}/>
                <span className="absolute transition-opacity duration-300"
                      style={{
                          opacity: isExtended ? 1 : 0
                      }}>
                    {props.title}
                </span>
            </div>
            <div className="flex
                            flex-col
                            gap-3">
                {
                    props.items.map(({ key, caption, shortCaption }) => (
                        <div key={key}
                             className="p-1
                                        h-[30px]
                                        relative
                                        overflow-hidden
                                        flex
                                        items-center
                                        justify-center
                                        rounded-md
                                        cursor-pointer
                                        hover:bg-gray-100
                                        dark:text-gray-400
                                        dark:hover:bg-gray-900"
                             onClick={() => props.onItemClick(key)}>
                            <>
                                <span className="absolute transition-opacity duration-300"
                                      style={{
                                          opacity: isExtended ? 1 : 0
                                      }}>
                                    {caption}
                                </span>
                                <span className="absolute transition-opacity duration-300"
                                      style={{
                                          opacity: isExtended ? 0 : 1
                                      }}>
                                    {shortCaption}
                                </span>
                            </>

                        </div>
                    ))
                }
            </div>
            <div className="relative
                            flex
                            grow
                            w-full
                            cursor-pointer
                            items-center
                            justify-end
                            w-full
                            min-h-[66px]
                            transition-opacity
                            opacity-0
                            hover:opacity-100"
                 onClick={() => setIsExtended((value) => !value)}>
                <div className="absolute
                                right-[13px]
                                bottom-[13px]
                                flex
                                items-center
                                bg-gray-300
                                w-4
                                h-[40px]
                                rounded-xl
                                text-2xl
                                dark:bg-gray-700
                                text-gray-500">
                    {
                        isExtended ?
                            <BsChevronCompactLeft/> :
                            <BsChevronCompactRight/>
                    }
                </div>
            </div>
        </div>
    );
}
