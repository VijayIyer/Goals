import React, {useCallback, useEffect, useState} from 'react';
import Task from './task';
import {TextField, Button, Grid2, Typography} from '@mui/material';
import { TaskType } from '../../types/task';
import './task.css';

export default function Tasks({
    userId
}: {userId: string}) {
    const [tasks, setTasks] = useState<Array<TaskType>>([]);

    const handleAddTaskClick = useCallback(() => {
        alert('Add Task!')
    }, []);

    return (
        <Grid2 textAlign={"center"}>
            <Typography variant="h5">Your Tasks</Typography>
            <Button onClick={handleAddTaskClick} variant="contained" color='primary'>Add Task</Button>
            {tasks.map(task => <Task task={task} />)}
        </Grid2>
    )
}