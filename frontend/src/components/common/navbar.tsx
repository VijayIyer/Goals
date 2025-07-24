import { NavLink, useLocation } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';

export default function Navbar() {
    const { pathname } = useLocation();
    return (
        <ButtonGroup>
            <NavLink to="/">
                <Button variant={pathname === '/' ? 'contained' : 'outlined'}>Active Tasks</Button>
            </NavLink>
            <NavLink to="/backlogged">
                <Button variant={pathname === '/backlogged' ? 'contained' : 'outlined'}>Deferred Tasks</Button>
            </NavLink>
            <NavLink to="/dashboard">
                <Button variant={pathname === '/dashboard' ? 'contained' : 'outlined'}>Summary</Button>
            </NavLink>
        </ButtonGroup>
    );
}
