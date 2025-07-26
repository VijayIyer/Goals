import dayjs, { Dayjs } from 'dayjs';

import { useContext } from 'react';
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import { Task } from '../../types/task';
import { ChangeEvent, FormEvent, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

import ServicesContext from '../../services/servicesProvider';
import { TaskServiceClientFactory } from '../../services/taskServiceClientFactory';
import { TaskPriority } from '../../enums';

type EditTaskModalProps = {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (editedTask: Task) => void;
};

export default ({ task, isOpen, onClose, onSubmit }: EditTaskModalProps) => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();

    const [editTaskError, setEditTaskError] = useState<string>('');
    const [isEditedTaskSubmitLoading, setIsEditTaskSubmitLoading] = useState<boolean>(false);
    const [editedTask, setEditedTask] = useState<Task>(task);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'deferred') {
            setEditedTask({
                ...editedTask,
                deferred: event.target.checked,
            });
        } else {
            setEditedTask({
                ...editedTask,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleSelectChange = (event: SelectChangeEvent<TaskPriority>) => {
        setEditedTask({
            ...editedTask,
            priority: event.target.value as TaskPriority,
        });
    };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsEditTaskSubmitLoading(true);
        service
            .editTask({
                ...editedTask,
                ...(task.deferred && { deferred: false }),
            })
            .then(onSubmit)
            .catch(setEditTaskError)
            .finally(() => setIsEditTaskSubmitLoading(false));
    };

    const handleDateChange = (deadline: Dayjs | null) => {
        setEditedTask({
            ...editedTask,
            deadline: dayjs(deadline).toDate(),
        });
    };
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
            }}
        >
            <DialogContent>
                <DialogContentText>Modify task contents</DialogContentText>
                {editTaskError && <Alert severity="error">{editTaskError}</Alert>}
                <TextField
                    required
                    margin="dense"
                    id="title"
                    name="title"
                    label="Title"
                    value={editedTask.title}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    style={{ marginBottom: '2em' }}
                />
                <TextField
                    id="description"
                    label="Description"
                    name="description"
                    placeholder="Add a description to add details of the task"
                    value={editedTask.description}
                    onChange={handleChange}
                    multiline
                    fullWidth
                    rows={2}
                    style={{ marginBottom: '2em' }}
                />
                <FormControl>
                    <FormControlLabel
                        control={<Checkbox name="deferred" onChange={handleChange} checked={editedTask.deferred} />}
                        label="Defer Task?"
                    />
                </FormControl>
                <div>
                    <DatePicker
                        name="deadline"
                        label="Deadline"
                        value={dayjs(editedTask.deadline) || ''}
                        onChange={handleDateChange}
                    />
                </div>
                <FormControl style={{ minWidth: '10em' }}>
                    <InputLabel>Priority</InputLabel>
                    <Select name="priority" label="Priority" value={editedTask.priority} onChange={handleSelectChange}>
                        {Object.values(TaskPriority).map(value => (
                            <MenuItem key={value} value={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
                {!task.deferred && (
                    <Button
                        type="submit"
                        variant="contained"
                        loading={isEditedTaskSubmitLoading}
                        loadingPosition="start"
                    >
                        Save
                    </Button>
                )}
                {task.deferred && (
                    <Button
                        type="submit"
                        variant="contained"
                        loading={isEditedTaskSubmitLoading}
                        loadingPosition="start"
                    >
                        Move to Active
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
