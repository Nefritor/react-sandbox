import {useEffect, useState} from 'react';

interface ITextShortenerProps {

    // Description
    value: string;

    // Description => Des-n : [[0, 3], '-', [-1]]
    shortKeys: ([number, number] & string)[];

    // 300
    duration: number;

    // false
    isShort: boolean;
}

TextShortener.defaultProps = {
    value: 'Description',
    shortKeys: [[0, 3], '-', [-1]],
    duration: 300,
    isShort: false
} as ITextShortenerProps;

const validate = (value: ITextShortenerProps['value'], shortKeys: ITextShortenerProps['shortKeys']) => {
    let min = 0;
    shortKeys.forEach((key, index) => {
        if (Array.isArray(key)) {
            const fixedValue = key.map((x) => x < 0 ? (value.length + x) : x)
            if (fixedValue[0] > fixedValue[1]) {
                throw new Error(`TextShortener: value ${key[0]} can't be greater than value ${key[1]} at shortKeys[${index}]`);
            } else if (fixedValue[0] >= 0) {
                if (fixedValue[0] < min) {
                    throw new Error(`TextShortener: value ${key[0]} must be greater than (or equals) ${fixedValue[0] === key[0] ? min : min - value.length} at shortKeys[${index}]`);
                } else {
                    min = fixedValue[1] || fixedValue[0];
                }
            }
        }
    })
}

const getAnimation = (value: ITextShortenerProps['value'], shortKeys: ITextShortenerProps['shortKeys']) => {
    const keys = shortKeys.filter((x) => Array.isArray(x)).map((x) => x.map((y) => y < 0 ? (value.length + y) : y));
    const animation = keys.reduce((anim, key, index) => {
        if (keys.length > index) {
            anim.push([key[1] || key[0], keys[index + 1][1] || keys[index + 1][0]])
        }
        return anim;
    }, [] as [number, number][])
}

export default function TextShortener(props: ITextShortenerProps): JSX.Element {
    const [text, setText] = useState(props.value);

    useEffect(() => {
        validate(props.value, props.shortKeys);
        //console.log(getAnimation(props.value, props.shortKeys))
    }, [props.value, props.shortKeys])

    return (<>{text}</>)
}