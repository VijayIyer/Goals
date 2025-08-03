import { NavLink, useLocation } from 'react-router-dom';
import { Button, ButtonGroup, CircularProgress } from '@mui/material';

import InformationTooltip from './informationTooltip';

interface NavbarProps {
    loading: boolean;
    numberOfActiveTasks: number;
    numberOfCompletedTasks: number;
    numberOfDeferredTasks: number;
}

export default function Navbar({
    loading,
    numberOfActiveTasks,
    numberOfCompletedTasks,
    numberOfDeferredTasks,
}: NavbarProps) {
    const { pathname } = useLocation();
    return (
        <ButtonGroup>
            <NavLink to="/">
                <Button
                    startIcon={
                        <InformationTooltip title="See active tasks that are completed against total active tasks" />
                    }
                    variant={pathname === '/' ? 'contained' : 'outlined'}
                >
                    {loading && <CircularProgress />}&nbsp;Active Tasks ({numberOfCompletedTasks} /{' '}
                    {numberOfActiveTasks})
                </Button>
            </NavLink>
            <NavLink to="/backlogged">
                <Button
                    startIcon={<InformationTooltip title="See tasks that have been deferred for later" />}
                    variant={pathname === '/backlogged' ? 'contained' : 'outlined'}
                >
                    {loading && <CircularProgress />}&nbsp;Deferred Tasks ({numberOfDeferredTasks})
                </Button>
            </NavLink>
            <NavLink to="/dashboard">
                <Button
                    startIcon={<InformationTooltip title="See overall stats" />}
                    variant={pathname === '/dashboard' ? 'contained' : 'outlined'}
                >
                    {loading && <CircularProgress />}&nbsp;Summary
                </Button>
            </NavLink>
        </ButtonGroup>
    );
}
