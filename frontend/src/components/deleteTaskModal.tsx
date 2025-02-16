import { FormEvent, useState, useContext } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import ServicesContext from '../services/servicesProvider';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';

type DeleteTaskModalProps = {
    id: number;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
};

export default ({ id, isOpen, onClose, onSubmit }: DeleteTaskModalProps) => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(
        serviceType,
    ).getServiceClient();
    const [isDeleteTaskSubmitLoading, setIsDeleteTaskSubmitLoading] =
        useState<boolean>(false);
    const [deleteTaskError, setDeleteTaskError] = useState<string>('');
    const handleDeleteTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsDeleteTaskSubmitLoading(true);
        service
            .deleteTaskById(id)
            .then(() => {
                onSubmit();
            })
            .catch(setDeleteTaskError)
            .finally(() => setIsDeleteTaskSubmitLoading(false));
    };
    return (
        <Dialog
            PaperProps={{
                component: 'form',
                onSubmit: handleDeleteTaskSubmit,
            }}
            open={isOpen}
            onClose={onClose}
        >
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the task?
                    {deleteTaskError && (
                        <Alert severity="error">{deleteTaskError}</Alert>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    loading={isDeleteTaskSubmitLoading}
                    loadingPosition="start"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};
