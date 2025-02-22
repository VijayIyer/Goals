import { FormEvent, useState, useContext } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import ServicesContext from '../services/servicesProvider';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';

const AddTaskModal = ({
    onClose,
    isAddTaskModalOpen = false,
    onSubmit,
}: {
    isAddTaskModalOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}) => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(
        serviceType,
    ).getServiceClient();
    const [isAddTaskLoading, setIsAddTaskLoading] = useState<boolean>(false);
    const [addTaskError, setAddTaskError] = useState<string>('');
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setIsAddTaskLoading(true);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const deadline = formData.get("deadline") as string;
        const deferred = formData.get("deferred") as string;
        service
            .createTask({
                title,
                description,
                deadline: deadline ? new Date(deadline) : new Date(),
                deferred: Boolean(deferred),
                completed: false,
            })
            .then(onSubmit)
            .catch(setAddTaskError)
            .finally(() => setIsAddTaskLoading(false));
    };
    return (
        <Dialog
            open={isAddTaskModalOpen}
            onClose={onClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: handleSubmit,
                },
            }}
        >
            <DialogContent>
                <DialogContentText>
                    Add a task with a deadline (default deadline will be the end
                    of the day)
                </DialogContentText>
                {addTaskError && <Alert severity="error">{addTaskError}</Alert>}
                <TextField
                    required
                    margin="dense"
                    id="title"
                    name="title"
                    label="Title"
                    fullWidth
                    variant="standard"
                    style={{ marginBottom: '2em' }}
                />
                <TextField
                    id="description"
                    label="Description"
                    name="description"
                    placeholder="Add a description to add details of the task"
                    required
                    multiline
                    fullWidth
                    rows={2}
                    style={{ marginBottom: '2em' }}
                />
                <DatePicker name="deadline" label="Deadline" disablePast />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={isAddTaskLoading}
                    loadingPosition="start"
                    variant="contained"
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddTaskModal;
