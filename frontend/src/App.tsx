import { useState } from "react";
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Task as TaskType } from "./taskTypes";

import { listTasks } from "./services/taskServices";

import Task from "./components/task";
import AddTaskModal from "./components/addTaskModal";

const App = () => {
  const [tasks, setTasks] = useState<Array<TaskType>>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const handleAddTaskButtonClick = () => {
    setIsAddTaskModalOpen(true);
  }
  const refreshTasks = async () => {
    const tempTasks = await listTasks();
    setTasks(tempTasks);
    console.log(`updated tasks - ${JSON.stringify(tempTasks)}, ${typeof tempTasks}`)
  }
  const handleAddTaskModalClose = () => {
    setIsAddTaskModalOpen(false);
  }
  const handleAddTaskModalSubmit = () => {
    refreshTasks();
    setIsAddTaskModalOpen(false);
  }
  console.log(`tasks are - ${JSON.stringify(tasks)}`)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{textAlign: "center"}}>
          <Button onClick={handleAddTaskButtonClick} variant="contained" startIcon={<AddIcon />}>
            Create Task
          </Button>
      </div>
      {<>{tasks.map(task => <Task key={task.id} task={task} onTaskEdited={refreshTasks} onTaskDeleted={refreshTasks} />)}</>}
      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        onClose={handleAddTaskModalClose}
        onSubmit={handleAddTaskModalSubmit}
      />
    </LocalizationProvider>
  )
};

export default App;