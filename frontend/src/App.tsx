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
import { CompletionInfo } from './types';

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
        marginBottom: '2em',
    },
});

const App = () => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [completedTasks, setCompletedTasks] = useState<CompletionInfo>();
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const refreshTasks = async () => {
        setIsRefreshing(true);
        setCompletedTasks(await service.getOverallTaskCompletionInfo());
        setIsRefreshing(false);
    };
    const handleAddTaskModalSubmit = () => {
        refreshTasks();
        setIsAddTaskModalOpen(false);
    };

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
                <Navbar
                    loading={isRefreshing}
                    numberOfActiveTasks={completedTasks?.total || 0}
                    numberOfCompletedTasks={completedTasks?.completed || 0}
                    numberOfDeferredTasks={completedTasks?.deferred || 0}
                />
                {isRefreshing && <CircularProgress />}
            </div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ActiveTasks
                            // FIXME: is there really no better way for triggering get tasks refresh from parent
                            totalNumberOfTasks={completedTasks?.total || 0}
                            onTaskEdited={refreshTasks}
                            onTaskDeleted={refreshTasks}
                        />
                    }
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route
                    path="/backlogged"
                    element={<BackloggedTasks onTaskEdited={refreshTasks} onTaskDeleted={refreshTasks} />}
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
