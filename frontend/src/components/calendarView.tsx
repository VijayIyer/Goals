import React from 'react';
import { ButtonGroup, Button } from '@mui/material';

export default function CalendarView() {
    //const [view, setView] = useState<'Week' | 'Month' | 'Year'>('Week');
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>
                In this page, you can view tasks grouped by day, week, month, year (default view is grouped by day)
            </h1>
            <ButtonGroup>
                <Button>Week</Button>
                <Button>Month</Button>
                <Button>Year</Button>
            </ButtonGroup>
        </>
    );
}
