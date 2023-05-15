import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Home from 'Home';

import DemoOutlet from 'Demo/DemoOutlet';
import DemoIndex from 'Demo/Index';

import PopupEdgeDemo from 'Demo/Pages/PopupEdgeDemo';
import SwitchDemo from 'Demo/Pages/SwitchDemo';
import SliderDemo from 'Demo/Pages/SliderDemo';
import FetcherDemo from 'Demo/Pages/FetcherDemo';
import InputTextDemo from 'Demo/Pages/InputTextDemo';
import TextShortenerDemo from 'Demo/Pages/TextShortenerDemo';
import MessengerDemo from 'Demo/Pages/MessengerDemo';
import HideLayoutDemo from 'Demo/Pages/HideLayoutDemo';
import TestDemo from 'Demo/Pages/TestDemo';

import {Main as Messenger} from 'Messenger/pages';

import {Main as Calendar} from 'Calendar/pages';

import {Main as Constructor} from 'Constructor/exercise';

import './index.css';

const demoPages = [{
    path: 'popup-edge',
    caption: 'Components/popup:Edge',
    shortCaption: 'Edge',
    element: <PopupEdgeDemo/>
}, {
    path: 'switch',
    caption: 'Components/toggle:Switch',
    shortCaption: 'Switch',
    element: <SwitchDemo/>
}, {
    path: 'slider-range',
    caption: 'Components/slider:Range',
    shortCaption: 'Range',
    element: <SliderDemo/>
}, {
    path: 'fetcher',
    caption: 'Components/hooks:useFetcher',
    shortCaption: 'useFetcher',
    element: <FetcherDemo/>
}, {
    path: 'input-text',
    caption: 'Components/input:Text',
    shortCaption: 'Text',
    element: <InputTextDemo/>
}, {
    path: 'text-shortener',
    caption: 'Components/animate:TextShortener',
    shortCaption: 'TextShortener',
    element: <TextShortenerDemo/>
}, {
    path: 'messenger',
    caption: 'Messenger/Index',
    shortCaption: 'Messenger',
    element: <MessengerDemo/>
}, {
    path: 'hide',
    caption: 'Components/layout:Hide',
    shortCaption: 'Hide',
    element: <HideLayoutDemo/>
}, {
    path: 'test',
    caption: 'Test',
    shortCaption: 'Test',
    element: <TestDemo/>
}]

const router = createBrowserRouter([{
    path: "/",
    element: <Home/>
}, {
    path: 'demo',
    element: <DemoOutlet pages={
        demoPages.map(({path, caption, shortCaption}) => ({path, caption, shortCaption}))
    }/>,
    children: [{
        index: true,
        element: <DemoIndex/>
    }, ...demoPages.map(({path, element}) => ({path, element}))]
}, {
    path: 'messenger',
    element: <Messenger/>
}, {
    path: 'calendar',
    element: <Calendar/>
}, {
    path: 'constructor',
    element: <Constructor/>
}]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
    .render(
        <RouterProvider router={router}/>
    );
