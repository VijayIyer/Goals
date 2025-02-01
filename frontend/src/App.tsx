import { FormEvent, useState } from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type Task =  {
  id: number,
  title: string, 
  description: string,
  deferred: boolean,
  deadline: Date  
}
type NewTask = {
  title: string, 
  description: string,
  deferred: boolean,
  deadline: Date
}

const mockTasks: Array<Task> = [];
const listTasksService = () => {
  return Promise.resolve(mockTasks);
}
const addTaskService = (newTask: NewTask) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const {title, description, deadline, deferred} = newTask;
      if(!title || !description || !deadline) rej('Error creating new task!');
      mockTasks.push({
        id: mockTasks.length,
        ...newTask
      });
      res(newTask);
    }, 1000);
  });
}

const App = () => {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const handleAddTaskButtonClick = () => {
    setIsAddTaskModalOpen(true);
  }
  const handleAddTaskModalClose = () => {
    setIsAddTaskModalOpen(false);
  }
  const handleAddTaskModalSubmit = async () => {
    const tempTasks = await listTasksService();
    setTasks(tempTasks);
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
      <>
      {tasks.map(task => {
        return <div key={task.id}>{JSON.stringify(task)}</div>
      })}
      </>
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
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const {title, description, deadline, deferred} = formJson;
    console.log(title, description, deadline);
    addTaskService({
      title,
      description,
      deadline: new Date(deadline),
      deferred: !!deferred
    })
    .then(onSubmit)
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

export default App;