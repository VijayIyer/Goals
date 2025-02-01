import { useState } from "react";
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Task } from "./taskTypes";

import { listTasks } from "./services";

import Tasks from "./tasks";
import AddTaskModal from "./addTaskModal";

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
    const tempTasks = await listTasks();
    setTasks(tempTasks);
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
      <Tasks tasks={tasks} />
      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        onClose={handleAddTaskModalClose}
        onSubmit={handleAddTaskModalSubmit}
      />
    </LocalizationProvider>
  )
};

export default App;