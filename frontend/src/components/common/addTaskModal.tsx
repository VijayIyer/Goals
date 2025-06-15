import { FormEvent, useState, useContext, useReducer, useEffect } from 'react';
import { NewTask } from '../../types';
import { TaskPriority } from '../../enums';

import {
    Alert,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Select,
    TextField,
    MenuItem,
    SelectChangeEvent,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import ServicesContext from '../../services/servicesProvider';
import { TaskServiceClientFactory } from '../../services/taskServiceClientFactory';
import dayjs from 'dayjs';

type AddTaskModalProps = {
    isAddTaskModalOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    viewingDate?: Date;
};

enum ActionType {
    UPDATE_TITLE,
    UPDATE_DESCRIPTION,
    UPDATE_PRIORITY,
    UPDATE_DEADLINE,
}

type Action =
    | { type: ActionType.UPDATE_TITLE; payload: string }
    | { type: ActionType.UPDATE_DESCRIPTION; payload: string }
    | { type: ActionType.UPDATE_DEADLINE; payload: Date }
    | {
          type: ActionType.UPDATE_PRIORITY;
          payload: TaskPriority;
      };

function formReducer(state: NewTask, action: Action): NewTask {
    switch (action.type) {
        case ActionType.UPDATE_TITLE:
            return {
                ...state,
                title: action.payload,
            };
        case ActionType.UPDATE_DESCRIPTION:
            return {
                ...state,
                description: action.payload,
            };
        case ActionType.UPDATE_PRIORITY:
            return {
                ...state,
                priority: action.payload,
            };
        case ActionType.UPDATE_DEADLINE:
            return {
                ...state,
                deadline: action.payload,
            };
        default:
            return { ...state };
    }
}

const INITIAL_STATE: NewTask = {
    title: '',
    description: '',
    deadline: new Date(),
    priority: TaskPriority.LOW,
};

const AddTaskModal = ({
    onClose,
    onSubmit,
    isAddTaskModalOpen = false,
    viewingDate = new Date(),
}: AddTaskModalProps) => {
    const { serviceType } = useContext(ServicesContext);
    const [formState, dispatch] = useReducer(formReducer, INITIAL_STATE);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [isAddTaskLoading, setIsAddTaskLoading] = useState<boolean>(false);
    const [addTaskError, setAddTaskError] = useState<string>('');

    const handleSelectChange = (event: SelectChangeEvent) => {
        if (Object.values(TaskPriority).includes(event.target.value as TaskPriority)) {
            dispatch({
                type: ActionType.UPDATE_PRIORITY,
                payload: event.target.value as TaskPriority,
            });
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsAddTaskLoading(true);
        const { title, description, deadline, priority } = formState;
        service
            .createTask({
                title,
                description,
                deadline: deadline ? new Date(deadline) : new Date(),
                priority,
            })
            .then(onSubmit)
            .catch(setAddTaskError)
            .finally(() => setIsAddTaskLoading(false));
    };

    useEffect(() => {
        if (viewingDate && !formState.deadline) {
            dispatch({
                type: ActionType.UPDATE_DEADLINE,
                payload: viewingDate,
            });
        }
    }, [viewingDate, formState.deadline]);

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
                    Add a task with a deadline (default deadline will be the end of the day)
                </DialogContentText>
                {addTaskError && <Alert severity="error">{addTaskError}</Alert>}
                <TextField
                    required
                    margin="dense"
                    id="title"
                    value={formState.title}
                    onChange={event => {
                        dispatch({
                            type: ActionType.UPDATE_TITLE,
                            payload: event.target.value,
                        });
                    }}
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
                    value={formState.description}
                    onChange={event => {
                        dispatch({
                            type: ActionType.UPDATE_DESCRIPTION,
                            payload: event.target.value,
                        });
                    }}
                    placeholder="Add a description to add details of the task"
                    required
                    multiline
                    fullWidth
                    rows={2}
                    style={{ marginBottom: '2em' }}
                />
                <DatePicker
                    name="deadline"
                    label="Deadline"
                    value={dayjs(formState.deadline)}
                    onChange={value => {
                        dispatch({
                            type: ActionType.UPDATE_DEADLINE,
                            payload: value ? value.toDate() : new Date(),
                        });
                    }}
                    disablePast
                    defaultValue={dayjs(formState.deadline)}
                />
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select name="priority" label="Priority" value={formState.priority} onChange={handleSelectChange}>
                        <MenuItem value={'HIGH'}>High</MenuItem>
                        <MenuItem value={'MEDIUM'}>Medium</MenuItem>
                        <MenuItem value={'LOW'}>Low</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
                <Button type="submit" loading={isAddTaskLoading} loadingPosition="start" variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddTaskModal;
