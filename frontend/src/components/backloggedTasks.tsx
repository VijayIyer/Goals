import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Button, CircularProgress, Grid2 as Grid, Typography } from '@mui/material';

import Task from './common/task';
import { Task as TaskType } from '../types';

// internal services and types imports
import ServicesContext from '../services/servicesProvider';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';

interface BackloggedTasksProps {
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
}

export default function BackloggedTasks({ onTaskEdited, onTaskDeleted }: BackloggedTasksProps) {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [numberOfTasksToDisplay, setNumberOfTasksToDisplay] = useState(10);
    const [deferredTasks, setDeferredTasks] = useState<Array<TaskType>>([]);
    const handleShowMoreClick = () => {
        setNumberOfTasksToDisplay(numberOfTasksToDisplay => numberOfTasksToDisplay + 10);
    };
    const handleShowAllClick = () => {
        setNumberOfTasksToDisplay(deferredTasks.length);
    };
    useEffect(() => {
        setIsRefreshing(true);
        const fetchDeferredTasks = async () => setDeferredTasks(await service.getTasks({ deferred: true }));
        fetchDeferredTasks();
        setIsRefreshing(false);
    }, []);
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
            {isRefreshing && <CircularProgress />}
            <Grid container alignItems="center" justifyContent="center">
                {deferredTasks.slice(0, numberOfTasksToDisplay).map(task => (
                    <Task key={task.id} task={task} onTaskEdited={onTaskEdited} onTaskDeleted={onTaskDeleted} />
                ))}
            </Grid>
        </>
    );
}
