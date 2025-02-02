import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, TextField, Typography } from "@mui/material";
import { Task } from "../taskTypes";
import { ChangeEvent, FormEvent, useState } from "react";
import { editTask } from "../services/taskServices";

type EditTaskModalProps = {
    task: Task,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: () => void
}

export default ({task, isOpen, onClose, onSubmit}: EditTaskModalProps) => {
    const [editTaskError, setEditTaskError] = useState<string>("");
    const [isEditedTaskSubmitLoading, setIsEditTaskSubmitLoading] = useState<boolean>(false);
    const [editedTask, setEditedTask] = useState<Task>(task);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditedTask({
            ...editedTask,
            [event.target.name]: event.target.value
        });
    }
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const {title, description, deferred} = formJson;
        console.log(title, description);
        setIsEditTaskSubmitLoading(true);
        editTask(editedTask)
            .then(onSubmit)
            .catch(setEditTaskError)
            .finally(() => setIsEditTaskSubmitLoading(false))
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
                   <FormControlLabel control={<Checkbox name="deferred" onChange={handleChange} value={editedTask.deferred} />} label="Defer Task?" />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Cancel</Button>
                <Button type="submit" variant="contained" loading={isEditedTaskSubmitLoading} loadingPosition="start">Save</Button>
            </DialogActions>
        </Dialog>
    );
}