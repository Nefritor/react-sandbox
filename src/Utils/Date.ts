import {DayMs, HourMs, MinuteMs, SecondMs} from '../Calendar/_constants/Day';

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const MONTHS_FULL = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
const MONTHS_FULL_DATE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const DAYS_FULL = ['понедельниек', 'вторник', 'среда', 'четверг', 'пятнца', 'суббота', 'воскресенье'];

const MS_IN_DAY = 86400000;

export enum MonthType {
    Simple,
    Full,
    FullDate
}

export enum DaysType {
    Simple,
    Full
}

export enum EveryType {
    Day,
    Hour,
    Minute,
    Second
}

export const formatDateTime = (time: number) => {
    const date = new Date(time);
    let value = getTime(date);
    const todayTime = new Date().setHours(0, 0, 0, 0);
    if (time < todayTime) {
        value = `${getDate(date, todayTime)} ` + value;
    }
    return value;
}

export const getDate = (date: Date, todayTime: number) => {
    const dateStartTime = new Date(date.getTime()).setHours(0, 0, 0, 0);
    const dayDiff = (todayTime - dateStartTime) / MS_IN_DAY;
    const value = (() => {
        switch (dayDiff) {
            case 0:
                return '';
            case 1:
                return 'вчера';
            default:
                return getDateMonth(date);
        }
    })()
    return value;
}

export const getTime = (date: Date, withSeconds: boolean = false) => {
    let time = `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`;
    if (withSeconds) {
        time += `:${leadingZero(date.getSeconds())}`;
    }
    return time;
}

export const getDateMonth = (date: Date, monthType: MonthType = MonthType.Simple) => {
    return `${date.getDate()} ${[MONTHS, MONTHS_FULL, MONTHS_FULL_DATE][monthType][date.getMonth()]}`
}

export const getWeekDay = (date: Date, daysType: DaysType = DaysType.Simple) => {
    return [DAYS, DAYS_FULL][daysType][(date.getDay() || 7) - 1];
}

export const leadingZero = (value: number) => {
    const newValue = value.toString();
    return newValue.length === 1 ? `0${newValue}` : newValue;
}

export const callEvery = (handler: () => void, type: EveryType = EveryType.Second) => {
    const now = new Date();
    const total = (() => {
        switch (type) {
            case EveryType.Day:
                return DayMs;
            case EveryType.Hour:
                return HourMs;
            case EveryType.Minute:
                return MinuteMs;
            case EveryType.Second:
                return SecondMs;
        }
    })();
    let current = now.getMilliseconds();
    if (type <= EveryType.Minute) {
        current += now.getSeconds() * SecondMs;
        if (type <= EveryType.Hour) {
            current += now.getMinutes() * MinuteMs;
            if (type <= EveryType.Day) {
                current += now.getHours() * HourMs;

            }
        }
    }
    setTimeout(handler, total - current);
}
