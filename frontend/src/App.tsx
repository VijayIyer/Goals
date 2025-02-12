import { useState } from "react";
import {Button, CircularProgress} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Task as TaskType } from "./taskTypes";

import { listTasks } from "./services/taskServices";

import Tasks from "./components/tasks";
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
  }
  const handleAddTaskModalClose = () => {
    setIsAddTaskModalOpen(false);
  }
  const handleAddTaskModalSubmit = () => {
    refreshTasks();
    setIsAddTaskModalOpen(false);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{textAlign: "center"}}>
          <Button onClick={handleAddTaskButtonClick} variant="contained" startIcon={<AddIcon />}>
            Create Task
          </Button>
      </div>
      <Tasks
        tasks={tasks}
        onTaskEdited={refreshTasks}
        onTaskDeleted={refreshTasks}
      />
      {isAddTaskModalOpen && (
        <AddTaskModal
          isAddTaskModalOpen={isAddTaskModalOpen}
          onClose={handleAddTaskModalClose}
          onSubmit={handleAddTaskModalSubmit}
        />
      )}
    </LocalizationProvider>
  )
};

export default App;