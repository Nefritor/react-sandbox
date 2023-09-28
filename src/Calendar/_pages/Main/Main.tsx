import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Background from 'Layout/Background';
import { ThemeSwitch } from 'Messenger/components';
import { Day, DayMs, WeekMs } from 'Calendar/constants';
import { View } from 'Calendar/grid';
import { GiBackPain, GiChestArmor, GiLegArmor, GiVolleyballBall } from 'react-icons/gi';
import { AiFillStar } from 'react-icons/ai';
import { callEvery, DaysType, EveryType, getDateMonth, getTime, getWeekDay, MonthType } from 'Utils/Date';

const startDate = new Date('04/24/2023');
const visibleDays = [ Day.Monday, Day.Wednesday, Day.Thursday, Day.Friday ];

interface ITrainingData {
    bodyPart: number;
    withTrainer: boolean;
}

enum BodyPart {
    Leg,
    Back,
    Chest,
    Volleyball
}

const trainingData = [
    [ 1, 0, 3, 2 ],
    [ 1, 0, 3 ],
    [ 2, 0, 3, 1 ],
    [ 2, 1, 3, 0 ],
    [ 1, 2, 3, 0 ],
    [ 1, 0, 3, 2 ],
    [ 0, 1, 3, 2 ],
    [ 0, 2, 3, 1 ],
    [ 2, 0, 3, 1 ],
    [ 2, 1, 3, 0 ],
    [ 1, 2, 3, 0 ],
    [ 1, 0, 3, 2 ],
    [ 0, 1, 3, 2 ]
];

const trainerDay = [ 3, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

const getTrainingDaysData = () => {
    const data: Record<string, ITrainingData> = {};
    trainingData.forEach((week, weekIndex) => {
        week.forEach((bodyPart, dayIndex) => {
            const date = new Date(startDate.getTime() + WeekMs * weekIndex + DayMs * visibleDays[dayIndex]);
            data[date.getTime()] = {
                bodyPart,
                withTrainer: trainerDay[weekIndex] === dayIndex
            };
        });
    });
    return data;
};

const getIcon = (bodyPart: BodyPart) => {
    const title = getCaption(bodyPart);
    switch (bodyPart) {
        case BodyPart.Leg:
            return <GiLegArmor title={title}/>;
        case BodyPart.Back:
            return <GiBackPain title={title}/>;
        case BodyPart.Chest:
            return <GiChestArmor title={title}/>;
        case BodyPart.Volleyball:
            return <GiVolleyballBall title={title}/>;
    }
};

const getCaption = (bodyPart: BodyPart | undefined) => {
    switch (bodyPart) {
        case BodyPart.Leg:
            return 'Ноги';
        case BodyPart.Back:
            return 'Спина';
        case BodyPart.Chest:
            return 'Грудь';
        case BodyPart.Volleyball:
            return 'Воллейбол';
        default:
            return 'Ничего';
    }
};

const getTodayBodyPart = (trainingData: Record<string, ITrainingData>) => {
    const now = new Date();
    return trainingData[now.setHours(0, 0, 0, 0)]?.bodyPart;
};

export default function Main(): JSX.Element {
    const trainingData = useMemo(getTrainingDaysData, []);
    const [ now, setNow ] = useState<Date>(new Date());
    const [ todayBodyPart, setTodayBodyPart ] = useState<BodyPart>(getTodayBodyPart(trainingData));

    useEffect(() => {
        callEvery(() => setNow(new Date()));
    }, [ now ]);

    useEffect(() => {
        callEvery(() => setTodayBodyPart(getTodayBodyPart(trainingData)), EveryType.Day);
    }, [ todayBodyPart, trainingData ]);

    useEffect(() => {
        document.title = 'Training calendar';
    }, []);

    return (
        <div className="w-screen h-screen">
            <Background className="p-3">
                <Suspense>
                    <ThemeSwitch className="absolute right-3 top-3 shadow-md"/>
                </Suspense>
                <div
                    className="flex flex-col max-w-[800px] w-full flex-grow min-h-[1px] self-center justify-self-center">
                    <div className="flex flex-col flex-shrink-0 h-[100px] dark:text-white">
                        <div className="flex items-baseline gap-3">
                            <span className="text-xl">Сегодня</span>
                            <span
                                className="text-xl bg-gray-300 dark:bg-gray-600 px-2 rounded-md">{getCaption(todayBodyPart)}</span>
                        </div>
                        <span className="text-3xl">
                            {`${getDateMonth(now, MonthType.FullDate)}, ${getWeekDay(now, DaysType.Full)}`}
                        </span>
                        <span className="text-2xl">
                            {getTime(now, true)}
                        </span>
                    </div>
                    <View startDate={startDate}
                        /*visibleDays={visibleDays}*/
                          weeksCount={14}
                          itemBottomContent={(props) =>
                              visibleDays.includes(props.weekday) ?
                                  <div className="relative">
                                      <div className="pb-2 flex justify-center text-4xl">
                                          {
                                              getIcon(trainingData[props.date.getTime()]?.bodyPart)
                                          }
                                      </div>
                                      {
                                          trainingData[props.date.getTime()]?.withTrainer &&
                                          <AiFillStar className="absolute top-0 right-2"
                                                      title="Занятие с тененром"/>
                                      }
                                  </div> :
                                  <></>
                          }/>
                </div>
            </Background>
        </div>
    );
}
