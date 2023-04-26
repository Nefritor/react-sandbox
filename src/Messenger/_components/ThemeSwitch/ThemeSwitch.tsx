import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import {FiMoon, FiSun} from 'react-icons/fi';

interface IProps {
    className: string;
}

if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'dark');
}

export default function ThemeSwitch(props: IProps): JSX.Element {
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark');

    const onSwitchClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setDarkTheme((value) => !value);
    }

    useEffect(() => {
        const classList = document.documentElement.classList;
        const icon = document.querySelector('link[rel="icon"]');
        const isDarkTheme = classList.contains('dark');
        if (darkTheme && !isDarkTheme) {
            classList.add('dark');
            localStorage.setItem('theme', 'dark');
            icon?.setAttribute('href', 'favicon-dark.ico');
        } else if (!darkTheme && isDarkTheme) {
            classList.remove('dark');
            localStorage.setItem('theme', 'light');
            icon?.setAttribute('href', 'favicon.ico');
        }
    }, [darkTheme]);

    return (
        <div className={clsx(
            'flex items-center justify-center h-12 w-12 rounded-full cursor-pointer hover:brightness-95 select-none',
            darkTheme ? 'bg-gray-600' : 'bg-amber-300',
            [props.className]
        )}
             onClick={onSwitchClick}>
            {
                darkTheme ? <FiMoon size={20}/> : <FiSun size={20}/>
            }
        </div>
    )
}
