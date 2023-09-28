import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from 'clsx';

interface IProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    height: number;
    width: number;
    padding: number;
}

Range.defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    height: 20,
    width: 200,
    padding: 3
};

const getPositionFromValue = (value: number, width: number, min: number, max: number) =>
    ((value - min) * width) / (max - min);

const getValueFromPosition = (position: number, width: number, min: number, max: number) =>
    Math.round((max - min) * (position / width) + min);

const getInnerPosition = (pos: number, sliderWidth: number) => {
    if (pos > sliderWidth) {
        return sliderWidth;
    } else if (pos < 0) {
        return 0;
    } else {
        return pos;
    }
};

const getInnerValue = (value: number, min: number, max: number) => {
    if (value > max) {
        return max;
    } else if (value < min) {
        return min;
    } else {
        return value;
    }
};

export default function Range(props: IProps) {
    const sliderRef = useRef<HTMLDivElement>(null);

    const [ isMoving, setIsMoving ] = useState(false);

    const buttonFixedDiameter = useMemo(
        () => (props.height - props.padding * 2),
        [ props.height, props.padding ]
    );

    const buttonFixedRadius = useMemo(
        () => buttonFixedDiameter / 2,
        [ buttonFixedDiameter ]
    );

    const buttonDiameter = useMemo(
        () => buttonFixedDiameter * (isMoving ? 2.5 : 1),
        [ buttonFixedDiameter, isMoving ]
    );

    const buttonRadius = useMemo(
        () => buttonDiameter / 2,
        [ buttonDiameter ]
    );

    const sliderWidth = useMemo(
        () => props.width - props.padding * 2 - buttonFixedDiameter,
        [ props.width, props.padding, buttonFixedDiameter ]
    );

    const [ position, setPosition ] = useState<number>(
        getPositionFromValue(
            getInnerValue(props.value, props.min, props.max),
            sliderWidth,
            props.min,
            props.max
        )
    );

    const startPosition = useRef<number>(position);

    const onMouseEnd = (e: MouseEvent) => {
        e.preventDefault();
        setIsMoving(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseEnd);
    };
    const onTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        setIsMoving(false);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
    };

    const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        onMoveProcess(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
        onMoveProcess(e.touches[0].clientX);
    };
    const onMoveProcess = (clientX: number) => {
        props.onChange(
            getValueFromPosition(
                getInnerPosition(clientX - startPosition.current, sliderWidth),
                sliderWidth,
                props.min,
                props.max
            )
        );
    };

    const onMouseStart = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onMoveStart(e.clientX);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseEnd);
    };
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        onMoveStart(e.touches[0].clientX);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
    };
    const onMoveStart = (clientX: number) => {
        if (sliderRef.current !== null) {
            startPosition.current = sliderRef.current.offsetLeft + buttonFixedRadius;
            setIsMoving(true);
            props.onChange(
                getValueFromPosition(
                    getInnerPosition(clientX - startPosition.current, sliderWidth),
                    sliderWidth,
                    props.min,
                    props.max
                )
            );
        }
    };

    useEffect(() => {
        const correctValue = getInnerValue(props.value, props.min, props.max);
        setPosition(
            getPositionFromValue(
                correctValue,
                sliderWidth,
                props.min,
                props.max
            )
        );
        if (correctValue !== props.value) {
            props.onChange(correctValue);
        }
    }, [ props.max, props.min, props.value, sliderWidth ]);

    return (
        <div className={clsx(
            'rounded-full relative cursor-pointer select-none bg-gray-600'
        )}
             style={{
                 height: props.height,
                 width: props.width
             }}
             ref={sliderRef}
             onMouseDown={onMouseStart}
             onTouchStart={onTouchStart}>
            <div className="absolute"
                 style={{
                     top: props.padding + buttonFixedRadius,
                     left: position + props.padding + buttonFixedRadius,
                     transition: isMoving ? undefined : 'left .3s ease'
                 }}>
                <div
                    className={clsx(
                        'flex items-center justify-center rounded-full absolute',
                        (isMoving ? 'bg-gray-500' : 'bg-gray-300')
                    )}
                    style={{
                        height: buttonDiameter,
                        width: buttonDiameter,
                        top: -buttonRadius,
                        left: -buttonRadius,
                        transition: 'height .15s ease, width .15s ease, top .15s ease, left .15s ease, background .15s ease'
                    }}>
                    <span className={'text-xs text-white ' + (isMoving ? 'opacity-1' : 'opacity-0')}
                          style={{
                              transition: 'opacity .15s ease'
                          }}>
                        {props.value}
                    </span>
                </div>
            </div>
        </div>
    );
}
