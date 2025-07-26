import { useEffect, useState, useContext } from 'react';
import { Button, Box, Card, CardActions, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

import { Task } from '../../types';

import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import MoveTaskToActiveModal from './moveTaskToActiveModal';
import EditTaskModal from './editTaskModal';
import DeleteTaskModal from './deleteTaskModal';

import ServicesContext from '../../services/servicesProvider';
import { TaskServiceClientFactory } from '../../services/taskServiceClientFactory';
import { TaskServiceClient } from '../../services/taskServiceClients/client';

export default ({
    task,
    onTaskEdited,
    onTaskDeleted,
}: {
    task: Task;
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
}) => {
    const { serviceType } = useContext(ServicesContext);
    const service: TaskServiceClient = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [isTaskCompleted, setIsTaskCompleted] = useState<boolean>(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
    const [showMoveTaskToActiveModal, setShowMoveTaskToActiveModal] = useState(false);

    const handleEditTaskModalButtonClick = () => {
        setIsEditTaskModalOpen(true);
    };
    const handleDeleteTaskModalButtonClick = () => {
        setIsDeleteTaskModalOpen(true);
    };

    const handleEditTaskModalSubmit = (submittedTaskUpdate: Task) => {
        setEditedTask(submittedTaskUpdate);
        onTaskEdited(submittedTaskUpdate.id);
        setIsEditTaskModalOpen(false);
    };

    const handleDeleteTaskModalSubmit = () => {
        onTaskDeleted();
        setIsDeleteTaskModalOpen(false);
    };

    const handleEditTaskMarkedCompletedClick = async () => {
        await service
            .editTask({
                ...editedTask,
                completed: !editedTask.completed,
            })
            .then((task: Task) => {
                setEditedTask(task);
                onTaskEdited(editedTask.id);
            });
    };

    const handleMoveToActiveTasksClick = () => {
        setShowMoveTaskToActiveModal(true);
    };

    const handleConfirmMoveTaskToActive = async () => {
        await service
            .editTask({
                ...editedTask,
                deferred: false,
                deadline: new Date(),
            })
            .then((task: Task) => {
                setEditedTask(task);
                setShowMoveTaskToActiveModal(false);
                onTaskEdited(editedTask.id);
            });
    };

    useEffect(() => {
        setIsTaskCompleted(task.completed);
    }, [task.completed]);

    return (
        <>
            <Card sx={{ maxWidth: 345, borderRadius: 5 }} raised>
                <CardContent>
                    <Typography noWrap gutterBottom variant="h5" component="div">
                        {editedTask.title}
                    </Typography>
                    {!editedTask.description && (
                        <Typography gutterBottom sx={{ fontWeight: 'light' }}>
                            No description added
                        </Typography>
                    )}
                    {editedTask.description && <Typography gutterBottom>{editedTask.description}</Typography>}
                    <Typography>{editedTask.priority}</Typography>
                    {editedTask.deferred && (
                        <Typography>This task is backlogged. Please update with a new deadline</Typography>
                    )}
                    {!editedTask.deferred && (
                        <Tooltip title="Deadline for completing task">
                            <Typography>
                                <Box
                                    sx={{
                                        fontStyle: 'italic',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <HourglassTopIcon color="primary" />
                                    {editedTask.deadline.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </Box>
                            </Typography>
                        </Tooltip>
                    )}
                </CardContent>
                <CardActions>
                    <Tooltip title="Edit Task Contents">
                        <IconButton size="large" color="primary" onClick={handleEditTaskModalButtonClick}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    {!editedTask.deferred && (
                        <Tooltip title="Mark Task as Completed">
                            <IconButton size="large" color="primary" onClick={handleEditTaskMarkedCompletedClick}>
                                {!isTaskCompleted && <CheckBoxOutlineBlankIcon />}
                                {isTaskCompleted && <CheckBoxIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Defer Task">
                        <IconButton size="large" color="primary" onClick={handleDeleteTaskModalButtonClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    {editedTask.deferred && (
                        <Button variant="contained" onClick={handleMoveToActiveTasksClick}>
                            Move to Active
                        </Button>
                    )}
                </CardActions>
            </Card>
            <MoveTaskToActiveModal
                isOpen={showMoveTaskToActiveModal}
                onClose={() => setShowMoveTaskToActiveModal(false)}
                onConfirm={handleConfirmMoveTaskToActive}
                onEdit={() => {
                    setShowMoveTaskToActiveModal(false);
                    setIsEditTaskModalOpen(true);
                }}
            />
            <EditTaskModal
                task={editedTask}
                isOpen={isEditTaskModalOpen}
                onClose={() => setIsEditTaskModalOpen(false)}
                onSubmit={handleEditTaskModalSubmit}
            />
            <DeleteTaskModal
                task={editedTask}
                isOpen={isDeleteTaskModalOpen}
                onClose={() => setIsDeleteTaskModalOpen(false)}
                onSubmit={handleDeleteTaskModalSubmit}
            />
        </>
    );
};
