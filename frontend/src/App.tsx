import { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { Task as TaskType } from './taskTypes';

import ServicesContext from './services/servicesProvider';
import { TaskServiceClientFactory } from './services/taskServiceClientFactory';

import Tasks from './components/tasks';
import AddTaskModal from './components/addTaskModal';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

const App = () => {
    const { serviceType } = useContext(ServicesContext);
    const [viewingDate, setViewingDate] = useState<Date>(new Date());
    const [showCalender, setShowCalendar] = useState<boolean>(false);
    const service = new TaskServiceClientFactory(
        serviceType,
    ).getServiceClient();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Array<TaskType>>([]);
    const [completedTasks, setCompletedTasks] = useState<Array<TaskType>>([]);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const handleAddTaskButtonClick = () => {
        setIsAddTaskModalOpen(true);
    };
    const refreshTasks = async () => {
        setIsRefreshing(true);
        const tempTasks = await service.getAllTasks(viewingDate);
        const tempCompletedTasks = await service.getAllTasks(viewingDate, true);
        console.log(
            JSON.stringify(tempTasks),
            JSON.stringify(tempCompletedTasks),
        );
        setTasks(tempTasks);
        setCompletedTasks(tempCompletedTasks);
        setIsRefreshing(false);
    };
    const handleAddTaskModalClose = () => {
        setIsAddTaskModalOpen(false);
    };
    const handleAddTaskModalSubmit = () => {
        refreshTasks();
        setIsAddTaskModalOpen(false);
    };

    const handleViewingDateChange = (value: Dayjs): void => {
        setViewingDate(value.toDate());
    };

    useEffect(() => {
        refreshTasks();
    }, [viewingDate]);

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2em',
                }}
            >
                <Button
                    onClick={handleAddTaskButtonClick}
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={isRefreshing}
                >
                    Create Task
                </Button>
                {tasks.length > 0 && (
                    <h4>
                        Completed Tasks : {completedTasks.length || 0}
                        &nbsp;/&nbsp;
                        {tasks.length}
                    </h4>
                )}
                {isRefreshing && <CircularProgress />}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="body1">
                    {viewingDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        day: 'numeric',
                        month: 'long',
                    })}
                </Typography>
                <Button onClick={() => setShowCalendar(value => !value)}>
                    View Tasks At Different Date
                </Button>
                {showCalender && (
                    <div>
                        <DateCalendar
                            value={dayjs(viewingDate) || dayjs(new Date())}
                            onChange={handleViewingDateChange}
                        />
                    </div>
                )}
            </div>
            <Tasks
                tasks={tasks}
                onTaskEdited={refreshTasks}
                onTaskDeleted={refreshTasks}
            />
            {isAddTaskModalOpen && (
                <AddTaskModal
                    isAddTaskModalOpen={isAddTaskModalOpen}
                    viewingDate={viewingDate}
                    onClose={handleAddTaskModalClose}
                    onSubmit={handleAddTaskModalSubmit}
                />
            )}
        </>
    );
};

export default App;
