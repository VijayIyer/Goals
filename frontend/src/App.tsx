// react core package imports
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// material imports
import { Button, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';

// internal services and types imports
import ServicesContext from './services/servicesProvider';
import { TaskServiceClientFactory } from './services/taskServiceClientFactory';
import { Task as TaskType } from './types';

// internal component imports
import ActiveTasks from './components/activeTasks';
import Dashboard from './components/dashboard';
import CalendarView from './components/calendarView';
import BackloggedTasks from './components/backloggedTasks';

// common component imports
import AddTaskModal from './components/common/addTaskModal';
import Navbar from './components/common/navbar';

const useStyles = makeStyles({
    topBar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2em',
    },
});

const App = () => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Array<TaskType>>([]);
    const [completedTasks, setCompletedTasks] = useState<Array<TaskType>>([]);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const refreshTasks = async () => {
        setIsRefreshing(true);
        setTasks(await service.getTasks(null));
        setCompletedTasks(await service.getTasks(null, true, true));
        setIsRefreshing(false);
    };
    const handleAddTaskModalSubmit = () => {
        refreshTasks();
        setIsAddTaskModalOpen(false);
    };
    const activeTasks: Array<TaskType> = tasks.filter(task => !task.deferred);
    const deferredTasks: Array<TaskType> = tasks.filter(task => task.deferred === true);

    useEffect(() => {
        refreshTasks();
    }, []);

    const classes = useStyles();

    return (
        <BrowserRouter>
            <div className={classes.topBar}>
                <Button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={isRefreshing}
                >
                    Create Task
                </Button>
                {tasks.length > 0 && (
                    <>
                        <h4>
                            Completed Tasks : {completedTasks.length}
                            &nbsp;/&nbsp;{activeTasks.length}
                        </h4>
                        <h4>Deferred Tasks : {deferredTasks.length}</h4>
                    </>
                )}
                <Navbar
                    numberOfActiveTasks={activeTasks.length}
                    totalTasks={tasks.length}
                    numberOfDeferredTasks={deferredTasks.length}
                />
                {isRefreshing && <CircularProgress />}
            </div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ActiveTasks tasks={activeTasks} onTaskEdited={refreshTasks} onTaskDeleted={refreshTasks} />
                    }
                />
                <Route path="/dashboard" element={<Dashboard tasks={activeTasks} />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route
                    path="/backlogged"
                    element={
                        <BackloggedTasks
                            deferredTasks={deferredTasks}
                            onTaskEdited={refreshTasks}
                            onTaskDeleted={refreshTasks}
                        />
                    }
                />
            </Routes>
            {isAddTaskModalOpen && (
                <AddTaskModal
                    isAddTaskModalOpen={isAddTaskModalOpen}
                    onClose={() => setIsAddTaskModalOpen(false)}
                    onSubmit={handleAddTaskModalSubmit}
                />
            )}
        </BrowserRouter>
    );
};

export default App;
