import {FormEvent, useState} from "react";
import { Alert, Button, Dialog, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { addTask } from "../services/taskServices";

const AddTaskModal = ({
    onClose,
    isAddTaskModalOpen = false,
    onSubmit
  }: {
    isAddTaskModalOpen: boolean,
    onClose: () => void,
    onSubmit: () => void
  }) => {
    const [isAddTaskLoading, setIsAddTaskLoading] = useState<boolean>(false);
    const [addTaskError, setAddTaskError] = useState<string>("");
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const {title, description, deadline, deferred} = formJson;
      setIsAddTaskLoading(true)
      addTask({
        title,
        description,
        deadline: deadline? new Date(deadline) : new Date(),
        deferred: !!deferred,
        completed: false
      })
      .then(onSubmit)
      .catch(setAddTaskError)
      .finally(() => setIsAddTaskLoading(false))
    }
    return (
      <Dialog
        open={isAddTaskModalOpen}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
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
              name="title"
              label="Title"
              fullWidth
              variant="standard"
              style={{marginBottom: "2em"}}
            />
            <TextField
              id="description"
              label="Description"
              name="description"
              placeholder="Add a description to add details of the task"
              required
              multiline
              fullWidth
              rows={2}
              style={{marginBottom: "2em"}}
            />
            <DatePicker
              name="deadline"
              label="Deadline"
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">Cancel</Button>
          <Button type="submit" loading={isAddTaskLoading} loadingPosition="start" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    )
  }
export default AddTaskModal;