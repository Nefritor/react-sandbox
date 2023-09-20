import { useEffect } from 'react';

export const Index = (): JSX.Element => {
    useEffect(() => {
        document.title = 'Poll application';
    }, []);

    return <div>Poll</div>;
};
