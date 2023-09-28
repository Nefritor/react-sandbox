import { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        document.title = 'N3F Home';
    }, []);

    return (
        <div>
            <div>Home</div>
            <p><a href="/demo">Demo</a></p>
            <p><a href="/messenger">Messenger</a></p>
            <p><a href="/calendar">Calendar</a></p>
            <p><a href="/constructor">Constructor</a></p>
            <p><a href="/apps">Apps</a></p>
        </div>
    );
}
