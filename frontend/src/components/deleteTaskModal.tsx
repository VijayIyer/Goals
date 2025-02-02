import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material"
import { deleteTask } from "../services/taskServices"
import { FormEvent } from "react"

type DeleteTaskModalProps = {
    id: number,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: () => void
}

export default ({id, isOpen, onClose, onSubmit}: DeleteTaskModalProps) => {
    const handleDeleteTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        deleteTask(id)
            .then(res => {
                console.log(`res - ${res}`);
                onSubmit();
            })
            .catch(console.error)
    }
    return (
        <Dialog 
            PaperProps={{
                component: 'form',
                onSubmit: handleDeleteTaskSubmit
            }}
            open={isOpen} 
            onClose={onClose}>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the task?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Delete</Button>
            </DialogActions>
        </Dialog>
    )
}