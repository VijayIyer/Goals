import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@mui/material';

type ComponentProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onEdit: () => void;
};
export default function MoveTaskToActiveModal({
    isOpen,
    onClose,
    onConfirm,
    onEdit,
}: ComponentProps) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContent>
                <DialogContentText>
                    The task will be moved back to active tasks with deadline
                    date of {new Date().toLocaleDateString()}. If you want to
                    edit the contents or change deadline date, click Edit
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={onConfirm}>
                    Confirm
                </Button>
                <Button variant="contained" onClick={onEdit}>
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
