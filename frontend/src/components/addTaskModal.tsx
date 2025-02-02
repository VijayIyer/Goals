import {FormEvent} from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { mockTasks } from "../mockTasks";
import { NewTask } from "../taskTypes";

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
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const {title, description, deadline, deferred} = formJson;
      console.log(title, description, deadline);
      addTask({
        title,
        description,
        deadline: new Date(deadline),
        deferred: !!deferred
      })
      .then(response => {
        console.log(`response - ${JSON.stringify(response)}`);
        onSubmit();
      })
      .catch(console.error)
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    )
  }
export default AddTaskModal;