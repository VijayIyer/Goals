import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//import dayjs, { Dayjs } from 'dayjs';
import { Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import ServicesContext from './services/servicesProvider';
import { TaskServiceClientFactory } from './services/taskServiceClientFactory';
import { Task as TaskType } from './types';

import Dashboard from './components/dashboard';
import Tasks from './components/activeTasks';
import AddTaskModal from './components/common/addTaskModal';
import Navbar from './components/common/navbar';
import CalendarView from './components/calendarView';
import BackloggedTasks from './components/backloggedTasks';

const App = () => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Array<TaskType>>([]);
    const [completedTasks, setCompletedTasks] = useState<Array<TaskType>>([]);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const handleAddTaskButtonClick = () => {
        setIsAddTaskModalOpen(true);
    };
    const refreshTasks = async () => {
        setIsRefreshing(true);
        setTasks(await service.getTasks(null));
        setCompletedTasks(await service.getTasks(null, true));
        setIsRefreshing(false);
    };
    const handleAddTaskModalClose = () => {
        setIsAddTaskModalOpen(false);
    };
    const handleAddTaskModalSubmit = () => {
        refreshTasks();
        setIsAddTaskModalOpen(false);
    };
    const activeTasks: Array<TaskType> = tasks.filter(task => !task.deferred);
    const deferredTasks: Array<TaskType> = tasks.filter(task => task.deferred);

    useEffect(() => {
        refreshTasks();
    }, []);

    return (
        <BrowserRouter>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2em' }}>
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
                        &nbsp;/&nbsp;{tasks.length}
                    </h4>
                )}
                <Navbar />
                {isRefreshing && <CircularProgress />}
            </div>

            <Routes>
                <Route
                    path="/"
                    element={<Tasks tasks={activeTasks} onTaskEdited={refreshTasks} onTaskDeleted={refreshTasks} />}
                />
                <Route path="/dashboard" element={<Dashboard tasks={tasks} />} />
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
                    onClose={handleAddTaskModalClose}
                    onSubmit={handleAddTaskModalSubmit}
                />
            )}
        </BrowserRouter>
    );
};

export default App;
