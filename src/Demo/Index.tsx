import Block from 'Layout/Block';
import { Button } from 'Components/button';
import { useNavigate } from 'react-router-dom';

export default function Index() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-3">
            <Block className="flex flex-col gap-3 items-center" shadow={true}>
                <span className="text-2xl text-blue-500 tracking-widest">THIS IS DEMO PAGES</span>
                <span className="text-sm text-gray-700 dark:text-gray-400">Use bottom navigation panel</span>
            </Block>
            <Button caption="Return to main page"
                    viewStyle="outlined"
                    onClick={() => navigate('/')}/>
        </div>
    );
}
