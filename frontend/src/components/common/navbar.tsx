import { NavLink, useLocation } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';

export default function Navbar({
    numberOfActiveTasks,
    numberOfCompletedTasks,
    numberOfDeferredTasks,
}: {
    numberOfActiveTasks: number;
    numberOfCompletedTasks: number;
    numberOfDeferredTasks: number;
}) {
    const { pathname } = useLocation();
    return (
        <ButtonGroup>
            <NavLink to="/">
                <Button variant={pathname === '/' ? 'contained' : 'outlined'}>
                    Active Tasks ({numberOfCompletedTasks} / {numberOfActiveTasks})
                </Button>
            </NavLink>
            <NavLink to="/backlogged">
                <Button variant={pathname === '/backlogged' ? 'contained' : 'outlined'}>
                    Deferred Tasks ({numberOfDeferredTasks})
                </Button>
            </NavLink>
            <NavLink to="/dashboard">
                <Button variant={pathname === '/dashboard' ? 'contained' : 'outlined'}>Summary</Button>
            </NavLink>
        </ButtonGroup>
    );
}
