import React, {ReactNode, Suspense, useEffect, useState} from 'react';
import {Day, DayMs, FullWeek, WeekDaysCount, WeekMs} from 'Calendar/constants';
import {IItemData, Item} from 'Calendar/grid';

interface IProps {
    startDate: Date;
    visibleDays?: Day[];
    weeksCount: number;
    blockSize?: IBlockSize;
    blockOffset?: IBlockOffset;
    itemBottomContent: (props: IItemData) => ReactNode;
}

interface IBlockSize {
    height: number;
    width: number;
}

interface IBlockOffset {
    vertical: number;
    horizontal: number;
}

interface IDay {
    date: Date;
    weekday: number;
    isActive: boolean;
}

interface IDayBlock {
    data: IDay;
    position: IPosition;
}

interface IPosition {
    top: number;
    left: number;
}

export default function View(
    {
        startDate,
        visibleDays = FullWeek,
        weeksCount,
        itemBottomContent,
        blockSize = {height: 80, width: 100},
        blockOffset = {vertical: 10, horizontal: 10}
    }: IProps
): JSX.Element {
    const [dayBlocks, setDayBlocks] = useState<IDayBlock[]>([]);

    useEffect(() => {
        setDayBlocks(() => {
            const startDayIndex = (startDate.getDay() || 7) - 1;
            const days: IDayBlock[] = [];
            for (let weekIndex = 0; weekIndex < weeksCount; weekIndex++) {
                for (let dayIndex = weekIndex === 0 ? startDayIndex : 0; dayIndex < WeekDaysCount; dayIndex++) {
                    days.push({
                        position: {
                            top: weekIndex && (weekIndex * (blockSize.height + blockOffset.vertical)),
                            left: dayIndex && (dayIndex * (blockSize.width + blockOffset.horizontal))
                        },
                        data: {
                            date: new Date(startDate.getTime() + (WeekMs * weekIndex) + (DayMs * (dayIndex - startDayIndex))),
                            weekday: dayIndex,
                            isActive: visibleDays.includes(dayIndex)
                        }
                    })
                }
            }
            return days;
        });
    }, [blockOffset.horizontal, blockOffset.vertical, blockSize.height, blockSize.width, startDate, visibleDays, weeksCount]);

    return (
        <div className='flex flex-col gap-3 relative scrollbar-thin'
             style={{
                 height: (blockSize.height * weeksCount) + (blockOffset.vertical * (weeksCount - 1))
             }}>
            <Suspense>
                {
                    dayBlocks.map((dayBlock, index) => (
                        <div key={index}
                             className='absolute'
                             style={dayBlock.position}>
                            <Item date={dayBlock.data.date}
                                  weekday={dayBlock.data.weekday}
                                  isActive={dayBlock.data.isActive}
                                  size={blockSize}
                                  bottomContent={itemBottomContent}/>
                        </div>
                    ))
                }
            </Suspense>
        </div>
    )
}
