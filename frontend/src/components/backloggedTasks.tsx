// import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Grid2 as Grid } from '@mui/material';

import Task from './common/task';
import { Task as TaskType } from '../types';

interface BackloggedTasksProps {
    deferredTasks: Array<TaskType>;
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
}

export default function BackloggedTasks({ deferredTasks, onTaskEdited, onTaskDeleted }: BackloggedTasksProps) {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button>
                    <Link to="/">Back to Active Tasks</Link>
                </Button>
            </div>
            <Grid container alignItems="center" justifyContent="center">
                {deferredTasks.map(task => (
                    <Task key={task.id} task={task} onTaskEdited={onTaskEdited} onTaskDeleted={onTaskDeleted} />
                ))}
            </Grid>
        </>
    );
}
