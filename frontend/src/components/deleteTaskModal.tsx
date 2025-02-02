import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material"

type DeleteTaskModalProps = {
    id: number,
    isOpen: boolean,
    onClose: () => void
}

export default ({id, isOpen, onClose}: DeleteTaskModalProps) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
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