import { FormEvent, useState } from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const App = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const handleAddTaskButtonClick = () => {
    setIsAddTaskModalOpen(true);
  }
  const handleAddTaskModalClose = () => {
    setIsAddTaskModalOpen(false);
  }
  const handleAddTaskModalSubmit = () => {
    console.log(`refresh tasks!`);
    setIsAddTaskModalOpen(false);
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{textAlign: "center"}}>
          <Button onClick={handleAddTaskButtonClick} variant="contained" startIcon={<AddIcon />}>
            Create Task
          </Button>
      </div>
      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        onClose={handleAddTaskModalClose}
        onSubmit={handleAddTaskModalSubmit}
      />
    </LocalizationProvider>
  )
};

const AddTaskModal = ({
  onClose,
  isAddTaskModalOpen = false,
  onSubmit
}: {
  isAddTaskModalOpen: boolean,
  onClose: () => void,
  onSubmit: () => void
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const {title, description, deadline} = formJson;
    console.log(title, description, deadline);
    onSubmit();
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

export default App;