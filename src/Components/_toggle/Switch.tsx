import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";

interface IProps {
    value: boolean;
    onChange: (value: boolean) => void;
    height: number;
    width: number;
    padding: number;
}

Switch.defaultProps = {
    value: false,
    height: 30,
    width: 50,
    padding: 3
}

export default function Switch(props: IProps): JSX.Element {
    const buttonSize = useMemo(
        () => props.height - props.padding * 2,
        [props.height, props.padding]
    );

    const sliderWidth = useMemo(
        () => props.width - props.padding * 2 - buttonSize,
        [props.width, props.padding, buttonSize]
    );

    const isMoved = useRef(false);

    const [position, setPosition] = useState<number>(0);
    const startPosition = useRef<number>(0);

    const getEndPosition = useCallback((pos: number) => {
        return pos > sliderWidth / 2 ? sliderWidth : 0;
    }, [sliderWidth]);

    const getInnerPosition = (pos: number) => {
        if (pos > sliderWidth) {
            return sliderWidth;
        } else if (pos < 0) {
            return 0;
        } else {
            return pos;
        }
    }

    const onMouseEnd = (e: MouseEvent) => {
        e.preventDefault();
        onMoveEnd();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseEnd);
    }
    const onTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        onMoveEnd();
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
    }
    const onMoveEnd = () => {
        if (isMoved.current) {
            isMoved.current = false;
            setPosition((pos) => getEndPosition(pos));
        } else {
            setPosition(props.value ? 0 : sliderWidth);
        }
    }

    const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        onMoveProcess(e.clientX - startPosition.current);
    }
    const onTouchMove = (e: TouchEvent) => {
        onMoveProcess(e.touches[0].clientX - startPosition.current);
    }
    const onMoveProcess = (newPosition: number) => {
        setPosition(getInnerPosition(newPosition));
        if (!isMoved.current) {
            isMoved.current = true;
        }
    }

    const onMouseStart = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onMoveStart(e.clientX);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseEnd);
    }
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        onMoveStart(e.touches[0].clientX);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
    }
    const onMoveStart = (clientX: number) => {
        startPosition.current = clientX - position;
    }

    useEffect(() => {
        if (position === 0 && props.value) {
            props.onChange(false);
        } else if (position === sliderWidth && !props.value) {
            props.onChange(true);
        }
    }, [position, sliderWidth]);

    useEffect(() => {
        setPosition(props.value ? sliderWidth : 0)
    }, [props.value, sliderWidth]);

    return (
        <div className='rounded-full relative cursor-pointer overflow-hidden'
             style={{
                 height: props.height,
                 width: props.width
             }}
             onMouseDown={onMouseStart}
             onTouchStart={onTouchStart}>
            <div className='w-full h-full absolute bg-amber-600'
                 style={{
                     opacity: position / sliderWidth
                 }}/>
            <div className='w-full h-full absolute bg-gray-600'
                 style={{
                     opacity: (sliderWidth - position) / sliderWidth
                 }}/>
            <div className='bg-gray-300 rounded-full absolute'
                 style={{
                     height: buttonSize,
                     width: buttonSize,
                     top: props.padding,
                     left: position + props.padding,
                     transition: isMoved.current ? undefined : 'left .3s ease'
                 }}/>
        </div>
    )
}