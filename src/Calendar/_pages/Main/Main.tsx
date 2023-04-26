import React, {Suspense, useMemo} from 'react';
import Background from 'Layout/Background';
import {ThemeSwitch} from 'Messenger/components';
import {Day, DayMs, WeekMs} from 'Calendar/constants';
import {View} from 'Calendar/grid';
import {GiBackPain, GiChestArmor, GiLegArmor} from 'react-icons/gi';
import {AiFillStar} from 'react-icons/ai';

const startTime = new Date('04/24/2023').getTime();
const visibleDays = [Day.Monday, Day.Wednesday, Day.Friday];

enum BodyPart {
    Leg,
    Back,
    Chest
}

const trainingData = [
    [1, 0, 2],
    [1, 0, 2],
    [0, 1, 2],
    [0, 2, 1],
    [2, 0, 1]
];

const trainerDay = [2, 1, 1, 1, 1];

const getTrainingDaysData = () => {
    const data: Record<string, { bodyPart: number, withTrainer: boolean }> = {};
    trainingData.forEach((week, weekIndex) => {
        week.forEach((bodyPart, dayIndex) => {
            const date = new Date(startTime + WeekMs * weekIndex + DayMs * visibleDays[dayIndex]);
            data[date.getTime()] = {
                bodyPart,
                withTrainer: trainerDay[weekIndex] === dayIndex
            };
        })
    })
    return data;
}

const getIcon = (bodyPart: BodyPart) => {
    switch (bodyPart) {
        case BodyPart.Leg:
            return <GiLegArmor title='Ноги'/>;
        case BodyPart.Back:
            return <GiBackPain title='Спина'/>;
        case BodyPart.Chest:
            return <GiChestArmor title='Грудь'/>;
    }
}

export default function Main(): JSX.Element {
    const trainingData = useMemo(getTrainingDaysData, []);
    return (
        <div className='w-screen h-screen'>
            <Background className='p-3'>
                <Suspense>
                    <ThemeSwitch className='absolute right-3 top-3 shadow-md'/>
                </Suspense>
                <View startTime={startTime}
                      visibleDays={visibleDays}
                      weeksCount={5}
                      itemBottomContent={(props) =>
                          visibleDays.includes(props.weekday) ?
                              <div className='relative'>
                                  <div className='pb-2 flex justify-center text-4xl'>
                                      {
                                          getIcon(trainingData[props.date.getTime()]?.bodyPart)
                                      }
                                  </div>
                                  {
                                      trainingData[props.date.getTime()]?.withTrainer &&
                                      <AiFillStar className='absolute top-0 right-2'
                                                  title='Занятие с тененром'/>
                                  }
                              </div> :
                              <></>
                      }/>
            </Background>
        </div>
    )
}
