import { FormEvent, useState } from "react"
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

import { deleteTask } from "../services/taskServices";

type DeleteTaskModalProps = {
    id: number,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: () => void
}

export default ({id, isOpen, onClose, onSubmit}: DeleteTaskModalProps) => {
    const [isDeleteTaskSubmitLoading, setIsDeleteTaskSubmitLoading] = useState<boolean>(false);
    const [deleteTaskError, setDeleteTaskError] = useState<string>("");
    const handleDeleteTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsDeleteTaskSubmitLoading(true)
        deleteTask(id)
            .then(res => {
                onSubmit();
            })
            .catch(setDeleteTaskError)
            .finally(() => setIsDeleteTaskSubmitLoading(false));
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
                    {deleteTaskError && <Alert severity="error">{deleteTaskError}</Alert>}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Cancel</Button>
                <Button type="submit" variant="contained" loading={isDeleteTaskSubmitLoading} loadingPosition="start">Delete</Button>
            </DialogActions>
        </Dialog>
    )
}