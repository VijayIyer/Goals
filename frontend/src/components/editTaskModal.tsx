import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, TextField, Typography } from "@mui/material";
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
    const [modifiedTask, setModifiedTask] = useState<Task>(task);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setModifiedTask({
            ...modifiedTask,
            [event.target.name]: event.target.value
        });
    }
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const {title, description, deferred} = formJson;
        console.log(title, description);
        editTask(modifiedTask)
            .then(onSubmit)
            .catch(console.error)
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
                <TextField
                    required
                    margin="dense"
                    id="title"
                    name="title"
                    label="Title"
                    value={modifiedTask.title}
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
                    value={modifiedTask.description}
                    onChange={handleChange}
                    multiline
                    fullWidth
                    rows={2}
                    style={{marginBottom: "2em"}}
                />
                <FormControl>
                   <FormControlLabel control={<Checkbox name="deferred" onChange={handleChange} value={modifiedTask.deferred} />} label="Defer Task?" />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
}