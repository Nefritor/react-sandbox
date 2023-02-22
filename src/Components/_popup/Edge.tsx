import clsx from "clsx";

interface IProps {
    layers: ILayer[];
    value: string | null;
    size: number;
    direction: TDirection;
}

export interface ILayer {
    key: string;
    content: JSX.Element;
}

export type TDirection = 'top' | 'right' | 'bottom' | 'left';

Edge.defaultProps = {
    direction: 'top',
    value: null,
    size: 100
}

export default function Edge(props: IProps) {
    const {layers, value, size, direction} = props;

    const getLayers = () => {
        return layers.map((layer) => (
            <div key={layer.key}
                 className={
                     clsx(
                         'absolute',
                         'transition-transform',
                         () => {
                             switch (direction) {
                                 case 'top':
                                     return 'bottom-0';
                                 case 'right':
                                     return 'left-0';
                                 case 'bottom':
                                     return 'top-0';
                                 case 'left':
                                     return 'right-0';
                             }
                         }
                     )
                 }
                 style={{
                     transform: `translate${isVertical ? 'Y' : 'X'}(${layer.key === value ? 0 : isVerse ? size : -size}px)`,
                 }}>
                {
                    layer.content
                }
            </div>
        ))
    }

    const isVertical = direction === 'top' || direction === 'bottom';

    const isVerse = direction === 'top' || direction === 'left';

    return (
        <div className={
            clsx(
                'relative',
                'h-full',
                'w-full'
            )
        }>
            <div className={
                clsx(
                    isVertical ? 'w-full' : 'h-full',
                    'absolute',
                    'overflow-hidden',
                    'transition-all'
                )
            }
                 style={{
                     ...(isVertical ? {
                         height: value ? size : 0
                     } : {
                         width: value ? size : 0
                     }),
                     transform: `translate${isVertical ? 'Y' : 'X'}(${value ? isVerse ? -size : 0 : 0}px)`,
                 }}>
                {
                    getLayers()
                }
            </div>
        </div>
    );
}
