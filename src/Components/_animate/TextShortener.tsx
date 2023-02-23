import {useCallback, useEffect, useRef, useState} from 'react';

interface ITextShortenerProps {

    // Description
    value: string;

    // Description => Dscrtpn : [[1, 1], [5, 1], [8, 2]]
    // hide (1) symbol from index [1], (1) symbols from index [5] and (2) symbols from index [8]
    hideKeys: [number, number][];

    // 300
    duration?: number;

    // false
    isShort: boolean;

    // 'left'
    direction?: 'left' | 'right'
}

interface IConfig {
    steps: string[];
    length: number;
    tick: number;
}

TextShortener.defaultProps = {
    value: 'Description',
    hideKeys: [[1, 1], [5, 5]],
    duration: 300,
    isShort: false,
    direction: 'right'
} as ITextShortenerProps;

const validate = (value: ITextShortenerProps['value'], shortKeys: ITextShortenerProps['hideKeys']) => {
    shortKeys.forEach((range, index, arr) => {
        if (arr.length - 1 > index) {
            if (range[0] >= arr[index + 1][0]) {
                throw new Error(`TextShortener (${value}): "index" value of [${range}] can't be greater than (or equals) "index" of [${arr[index + 1]}] at hideKeys[${index} -> ${index + 1}]`);
            } else if ((range[0] + range[1]) >= arr[index + 1][0]) {
                throw new Error(`TextShortener: sum of "index" and "delete count" values of [${range}] can't be greater than "index" of [${arr[index + 1]}] at hideKeys[${index} -> ${index + 1}]`);
            }
        } else if ((range[0] + range[1]) > value.length) {
            throw new Error(`TextShortener (${value}): sum of "index" and "delete count" values of [${range}] can't be greater than value length (${value.length}) at hideKeys[${index}]`);
        }
    })
}

const getConfig = (value: ITextShortenerProps['value'],
                   hideKeys: ITextShortenerProps['hideKeys'],
                   duration: ITextShortenerProps['duration'],
                   direction: ITextShortenerProps['direction']): IConfig => {
    const fragments = value.split('');
    const keys = hideKeys.reduceRight((steps, range) => {
        for (let i = range[1] - 1; i >= 0; i--) {
            steps.push(range[0] + i);
        }
        return steps;
    }, [] as number[]);

    const length = keys.length + 1;

    if (direction === 'right') {
        keys.reverse();
    }

    return {
        steps: [value, ...keys.map((x, index) => {
            fragments.splice(direction === 'right' ? (x - index) : x, 1);
            return fragments.join('');
        })],
        length,
        tick: (duration || 300) / length
    }
}

const getNextStepValue = (target: number, currentValue: number): number => {
    if (target > currentValue) {
        return ++currentValue;
    } else if (target < currentValue) {
        return --currentValue;
    } else {
        return currentValue;
    }
}

export default function TextShortener(props: ITextShortenerProps): JSX.Element {
    const [text, setText] = useState(props.value);

    const config = useRef<IConfig>(getConfig(props.value, props.hideKeys, props.duration, props.direction));
    const step = useRef<number>(props.isShort ? config.current.length : 0);
    const timeout = useRef<number>(0);

    const updateText = useCallback((target: number) => {
        step.current = getNextStepValue(target, step.current);
        setText(config.current.steps[step.current]);
        if (step.current !== target) {
            timeout.current = window.setTimeout(() => {
                updateText(target);
            }, config.current.tick)
        }
    }, [])

    useEffect(() => {
        validate(props.value, props.hideKeys);
        config.current = getConfig(props.value, props.hideKeys, props.duration, props.direction);
    }, []);

    useEffect(() => {
        if (timeout.current) {
            window.clearTimeout(timeout.current);
        }
        updateText(props.isShort ? config.current.length - 1 : 0);
    }, [props.isShort, updateText]);

    return (<>{text}</>)
}