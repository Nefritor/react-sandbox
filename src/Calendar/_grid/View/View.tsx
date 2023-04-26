import React, {ReactNode, Suspense, useState} from 'react';
import {Day, DayMs, FullWeek, WeekDaysCount, WeekMs} from 'Calendar/constants';
import {Item, IItemData} from 'Calendar/grid';
import Block from 'Layout/Block';
import {getDateMonth, MonthType, getWeekDay, DaysType} from 'Utils/Date';

interface IProps {
    startTime: number;
    visibleDays?: Day[];
    weeksCount: number;
    itemBottomContent: (props: IItemData) => ReactNode;
}

interface IDay {
    date: Date;
    weekday: number;
    isActive: boolean;
}

type IWeek = IDay[];
type IDates = IWeek[];

const getInitialDates = (startTime: number, visibleDays: Day[], weeksCount: number): IDates => {
    const startDayIndex = (new Date(startTime).getDay() || 7) - 1;
    return new Array(weeksCount).fill(undefined).map((_, weekIndex) => {
        const week = new Array(WeekDaysCount);
        for (let dayIndex = 0; dayIndex < WeekDaysCount; dayIndex++) {
            if (weekIndex !== 0 || dayIndex >= startDayIndex) {
                const date = new Date(startTime + (WeekMs * weekIndex) + (DayMs * (dayIndex - startDayIndex)));
                if (date.getTime() >= startTime) {
                    week[dayIndex] = {
                        date,
                        weekday: dayIndex,
                        isActive: visibleDays.includes(dayIndex)
                    }
                }
            }
        }
        return week;
    })
}

const now = new Date();

export default function View(
    {
        startTime,
        visibleDays = FullWeek,
        weeksCount,
        itemBottomContent
    }: IProps
): JSX.Element {
    const [dates, setDates] = useState<IDates>(getInitialDates(startTime, visibleDays, weeksCount));

    return (
        <div className='flex flex-col max-w-[800px] w-full flex-grow min-h-[1px] self-center justify-self-center '>
            <div className='flex flex-col flex-shrink-0 h-[75px] dark:text-white'>
                <span className='text-xl'>Сегодня</span>
                <span className='text-3xl'>
                    {
                        `${getDateMonth(now, MonthType.FullDate)}, ${getWeekDay(now, DaysType.Full)}`
                    }
                </span>
            </div>
            <Block className='scrollbar-thin'>
                <div className='flex flex-col gap-3 relative'>
                    <Suspense>
                        {
                            dates.map((week, weekIndex) => (
                                <div className='flex gap-3 h-[80px]'
                                     key={weekIndex}>
                                    {
                                        week.map((day) => (
                                            <Item key={`${weekIndex}:${day.weekday}`}
                                                  className='absolute w-[100px]'
                                                  style={{
                                                      left: day.weekday && (day.weekday * 100 + day.weekday * 12)
                                                  }}
                                                  date={day.date}
                                                  weekday={day.weekday}
                                                  isActive={day.isActive}
                                                  bottomContent={itemBottomContent}/>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </Suspense>
                </div>
            </Block>
        </div>
    )
}
