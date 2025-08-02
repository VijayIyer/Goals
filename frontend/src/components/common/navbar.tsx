import { NavLink, useLocation } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';

import InformationTooltip from './informationTooltip';

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
                <Button
                    startIcon={
                        <InformationTooltip title="See active tasks that are completed against total active tasks" />
                    }
                    variant={pathname === '/' ? 'contained' : 'outlined'}
                >
                    Active Tasks ({numberOfCompletedTasks} / {numberOfActiveTasks})
                </Button>
            </NavLink>
            <NavLink to="/backlogged">
                <Button
                    startIcon={<InformationTooltip title="See tasks that have been deferred for later" />}
                    variant={pathname === '/backlogged' ? 'contained' : 'outlined'}
                >
                    Deferred Tasks ({numberOfDeferredTasks})
                </Button>
            </NavLink>
            <NavLink to="/dashboard">
                <Button
                    startIcon={<InformationTooltip title="See overall stats" />}
                    variant={pathname === '/dashboard' ? 'contained' : 'outlined'}
                >
                    Summary
                </Button>
            </NavLink>
        </ButtonGroup>
    );
}
