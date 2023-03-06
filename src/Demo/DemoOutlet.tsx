import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {useCallback, useMemo} from 'react';
import {Navigation} from 'Components/menu';

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
    const location = useLocation();

    const items = useMemo(() => props.pages.map((page) => ({
        key: page.path,
        caption: page.caption,
        shortCaption: page.shortCaption
    })), [props.pages]);

    const onItemClick = useCallback((key: string | null) => {
        const newKey = '/demo/' + (key || '')
        navigate(newKey);
    }, [navigate]);

    return (
        <div className='flex w-screen h-screen'>
            <Outlet/>
            <Navigation selectedKey={location.pathname.replace('/demo/', '') || null}
                        items={items}
                        onItemClick={onItemClick}/>
        </div>
    );
}