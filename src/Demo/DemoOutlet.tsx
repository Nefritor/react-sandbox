import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { Suspense, useCallback, useEffect, useMemo } from 'react';
import { Navigation } from 'Components/menu';
import Background from 'Layout/Background';
import { ThemeSwitch } from 'Messenger/components';

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
    })), [ props.pages ]);

    const onItemClick = useCallback((key: string | null) => {
        const newKey = '/demo/' + (key || '');
        navigate(newKey);
    }, [ navigate ]);

    useEffect(() => {
        document.title = 'Demo components';
    }, []);

    return (
        <div className="flex w-screen h-screen">
            <Background className="items-center justify-center relative">
                <Suspense>
                    <ThemeSwitch className="absolute right-3 top-3 shadow-md"/>
                </Suspense>
                <Outlet/>
            </Background>
            <Navigation selectedKey={location.pathname.replace('/demo/', '') || null}
                        items={items}
                        onItemClick={onItemClick}/>
        </div>
    );
}
