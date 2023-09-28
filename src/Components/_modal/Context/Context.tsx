import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export const ModalContext = createContext<Dispatch<SetStateAction<JSX.Element | null>>>(() => <></>);

export const useModal = (element: JSX.Element) => {
    const setWindow = useContext(ModalContext);
    return (isVisible: boolean) => {
        setWindow(isVisible ? element : null);
    };
};
