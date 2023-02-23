import {Outlet, useNavigate} from 'react-router-dom';

import {Side} from 'Components/menu';
import {useCallback, useMemo} from 'react';

interface IPage {
    path: string;
    caption: string;
    shortCaption: string;
}

interface IDemoOutletProps {
    pages: IPage[];
}

export default function DemoOutlet(props: IDemoOutletProps) {
    const navigate = useNavigate();

    const items = useMemo(() => props.pages.map((page) => ({
        key: page.path,
        caption: page.caption,
        shortCaption: page.shortCaption
    })), [props.pages]);

    const onItemClick = useCallback((key: string | null) => {
        navigate(key || '/demo');
    }, [navigate]);

    return (
        <div className='flex w-screen h-screen'>
            <Side title='DEMO'
                  items={items}
                  onItemClick={onItemClick}/>
            <div className='grow overflow-hidden shadow-xl'>
                <Outlet/>
            </div>
        </div>
    );
}