import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Grid2 as Grid, Typography } from '@mui/material';

import Task from './common/task';
import { Task as TaskType } from '../types';

interface BackloggedTasksProps {
    deferredTasks: Array<TaskType>;
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
}

export default function BackloggedTasks({ deferredTasks, onTaskEdited, onTaskDeleted }: BackloggedTasksProps) {
    const [numberOfTasksToDisplay, setNumberOfTasksToDisplay] = useState(10);
    const handleShowMoreClick = () => {
        setNumberOfTasksToDisplay(numberOfTasksToDisplay => numberOfTasksToDisplay + 10);
    };
    const handleShowAllClick = () => {
        setNumberOfTasksToDisplay(deferredTasks.length);
    };
    return (
        <>
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button>
                        <Link to="/">Back to Active Tasks</Link>
                    </Button>
                    <Button variant="contained" onClick={handleShowMoreClick}>
                        Show more
                    </Button>
                    <Button variant="contained" onClick={handleShowAllClick}>
                        Show all backlogged tasks
                    </Button>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Typography>{`Showing ${numberOfTasksToDisplay} backlogged tasks`}</Typography>
                </div>
            </div>
            <Grid container alignItems="center" justifyContent="center">
                {deferredTasks.slice(0, numberOfTasksToDisplay).map(task => (
                    <Task key={task.id} task={task} onTaskEdited={onTaskEdited} onTaskDeleted={onTaskDeleted} />
                ))}
            </Grid>
        </>
    );
}
