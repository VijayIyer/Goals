import { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { CompletedTasksInfo, Task as TaskType } from './taskTypes';

import ServicesContext from './services/servicesProvider';
import { TaskServiceClientFactory } from './services/taskServiceClientFactory';

import Tasks from './components/tasks';
import AddTaskModal from './components/addTaskModal';

const App = () => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(
        serviceType,
    ).getServiceClient();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Array<TaskType>>([]);
    const [completedTasks, setCompletedTasks] = useState<CompletedTasksInfo>();
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const handleAddTaskButtonClick = () => {
        setIsAddTaskModalOpen(true);
    };
    const refreshTasks = async () => {
        setIsRefreshing(true);
        const tempTasks = await service.getAllTasks();
        const tempCompletedTasks = await service.getCompletedTasks();
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

    useEffect(() => {
        refreshTasks();
    }, []);

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <Button
                    onClick={handleAddTaskButtonClick}
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={isRefreshing}
                >
                    Create Task
                </Button>
                {isRefreshing && <CircularProgress />}
            </div>
            {tasks.length && <div>{completedTasks?.completed || 0} / {completedTasks?.total || tasks.length}</div>}
            <Tasks
                tasks={tasks}
                onTaskEdited={refreshTasks}
                onTaskDeleted={refreshTasks}
            />
            {isAddTaskModalOpen && (
                <AddTaskModal
                    isAddTaskModalOpen={isAddTaskModalOpen}
                    onClose={handleAddTaskModalClose}
                    onSubmit={handleAddTaskModalSubmit}
                />
            )}
        </>
    );
};

export default App;
