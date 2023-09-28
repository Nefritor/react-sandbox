import clsx from 'clsx';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

interface IProps {
    isHidden: boolean;
    className?: string;
    children: JSX.Element;
    duration?: number;
}

const setVisibleByFrames = (ref: MutableRefObject<HTMLDivElement | null>, callback: () => void) => {
    if (!ref.current?.offsetWidth) {
        requestAnimationFrame((time) => {
            setVisibleByFrames(ref, callback);
        });
    } else {
        callback();
    }
};

export const Hide = (props: IProps): JSX.Element => {
    const [ opacity, setOpacity ] = useState(props.isHidden ? 0 : 1);
    const [ visible, setVisible ] = useState(!props.isHidden);

    const ref = useRef<HTMLDivElement | null>(null);
    const timeout = useRef<number>();

    useEffect(() => {
        if (props.isHidden) {
            setOpacity(0);
            timeout.current = window.setTimeout(() => {
                setVisible(false);
                timeout.current = undefined;
            }, props.duration);
        } else {
            window.clearTimeout(timeout.current);
            setVisible(true);
            setVisibleByFrames(ref, () => setOpacity(1));
        }
    }, [ props.isHidden ]);

    return (
        <>
            {
                visible &&
                <div ref={ref}
                     className={clsx(
                         opacity ? 'opacity-100' : 'opacity-0',
                         [ props.className ])}
                     style={{
                         transition: `opacity ${props.duration}ms ease`
                     }}>
                    {props.children}
                </div>
            }
        </>
    );
};
