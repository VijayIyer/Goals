import dayjs, { Dayjs } from 'dayjs';

import { useContext } from 'react';
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, TextField, Typography } from "@mui/material";
import { Task } from "../taskTypes";
import { ChangeEvent, FormEvent, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";

import ServicesContext from "../services/servicesProvider";
import { TaskServiceClientFactory } from "../services/taskServiceClientFactory";

type EditTaskModalProps = {
    task: Task,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (editedTask: Task) => void
}

export default ({task, isOpen, onClose, onSubmit}: EditTaskModalProps) => {
	const {serviceType} = useContext(ServicesContext);
	const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [editTaskError, setEditTaskError] = useState<string>("");
    const [isEditedTaskSubmitLoading, setIsEditTaskSubmitLoading] = useState<boolean>(false);
    const [editedTask, setEditedTask] = useState<Task>(task);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.name === "deferred") {
            setEditedTask({
                ...editedTask,
                deferred: event.target.checked
            })
        }
        else {
            setEditedTask({
                ...editedTask,
                [event.target.name]: event.target.value
            });
        }
    }
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsEditTaskSubmitLoading(true);
        service.editTask(editedTask)
            .then((editedTask: any) => ({
                ...editedTask,
                deadline: dayjs(editedTask).toDate()
            }))
            .then(onSubmit)
            .catch(setEditTaskError)
            .finally(() => setIsEditTaskSubmitLoading(false))
    }

    const handleDateChange = (deadline: any) => {
        setEditedTask({
            ...editedTask,
            deadline: dayjs(deadline).toDate()
        });
    }
    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit
              }}
            >
            <DialogContent>
                <DialogContentText>
                Modify task contents
                </DialogContentText>
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
                    style={{marginBottom: "2em"}}
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
                    style={{marginBottom: "2em"}}
                />
                <FormControl>
                   <FormControlLabel control={<Checkbox name="deferred" onChange={handleChange} checked={editedTask.deferred} />} label="Defer Task?" />
                </FormControl>
                <div>
                    <DatePicker
                        name="deadline"
                        label="Deadline"
                        value={dayjs(editedTask.deadline)}
                        onChange={handleDateChange}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Cancel</Button>
                <Button type="submit" variant="contained" loading={isEditedTaskSubmitLoading} loadingPosition="start">Save</Button>
            </DialogActions>
        </Dialog>
    );
}