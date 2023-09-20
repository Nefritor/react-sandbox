import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Button } from 'Components/button';
import { Selector } from 'Components/list';

import { DEFAULT_APP } from './Constants';
import AppList from './AppList.json';

interface IAppItem {
    name: string;
    path: string;
}

export const Index = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();

    const [ selectedApp, setSelectedApp ] = useState<string>();

    const changeApp = useCallback((path: string) => {
        setSelectedApp(path);
    }, []);

    useEffect(() => {
        const classList = document.documentElement.classList;
        const icon = document.querySelector('link[rel="icon"]');
        const isDarkTheme = classList.contains('dark');
        if (!isDarkTheme) {
            classList.add('dark');
            localStorage.setItem('theme', 'dark');
            icon?.setAttribute('href', 'favicon-dark.ico');
        }
        document.title = 'Applications';
    }, []);

    useEffect(() => {
        if (!selectedApp) {
            setSelectedApp(DEFAULT_APP);
        } else {
            navigate(`/apps/${selectedApp}`);
        }
    }, [ navigate, selectedApp ]);

    return <div className="flex w-screen h-screen dark:bg-gray-700">
        <div className="w-[250px] m-4 gap-3 flex flex-col">
            <Selector<IAppItem> keyProperty="name"
                                titleProperty="name"
                                items={AppList}
                                onSelectedItemChanged={(item) => changeApp(item.path)}/>
        </div>
        <div className="flex-grow p-4">
            <Outlet/>
        </div>
    </div>;
};
