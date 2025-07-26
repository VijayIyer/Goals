import { FormEvent, useState, useContext } from 'react';
import {
    Alert,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ServicesContext from '../../services/servicesProvider';
import { TaskServiceClientFactory } from '../../services/taskServiceClientFactory';
import { Task } from '../../types';

type DeleteTaskModalProps = {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
};

export default ({ task, isOpen, onClose, onSubmit }: DeleteTaskModalProps) => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleteTaskSubmitLoading, setIsDeleteTaskSubmitLoading] = useState<boolean>(false);
    const [deleteTaskError, setDeleteTaskError] = useState<string>('');
    const handleDeleteTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsDeleteTaskSubmitLoading(true);
        service
            .deleteTaskById(task.id)
            .then(() => {
                onSubmit();
            })
            .catch(setDeleteTaskError)
            .finally(() => setIsDeleteTaskSubmitLoading(false));
    };
    return (
        <Dialog
            PaperProps={{
                component: 'form',
                onSubmit: handleDeleteTaskSubmit,
            }}
            open={isOpen}
            onClose={onClose}
        >
            <DialogContent>
                <DialogContentText>
                    <Typography>Are you sure you want to delete the task?</Typography>
                    {deleteTaskError && <Alert severity="error">{deleteTaskError}</Alert>}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Task Details</Typography>
                        <IconButton style={{ marginLeft: 'auto' }} onClick={() => setIsExpanded(val => !val)}>
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Typography variant="subtitle2">Title: {task.title}</Typography>
                        <Typography variant="subtitle2">Deadline: {task.deadline.toDateString()}</Typography>
                        <Typography variant="subtitle2">
                            Completion Status: {task.completed ? 'Completed' : 'Pending'}
                        </Typography>
                    </Collapse>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
                <Button type="submit" variant="contained" loading={isDeleteTaskSubmitLoading} loadingPosition="start">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};
