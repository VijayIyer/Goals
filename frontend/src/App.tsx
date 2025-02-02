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
  const [areTasksLoading, setAreTasksLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Array<TaskType>>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const handleAddTaskButtonClick = () => {
    setIsAddTaskModalOpen(true);
  }
  const refreshTasks = async () => {
    setAreTasksLoading(true);
    const tempTasks = await listTasks();
    setTasks(tempTasks);
    setAreTasksLoading(false);
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
      {areTasksLoading && (
        <div style={{textAlign: "center"}}>
          <CircularProgress size="2rem" />
        </div>
      )}
      {!areTasksLoading && (
        <Tasks
          tasks={tasks}
          onTaskEdited={refreshTasks}
          onTaskDeleted={refreshTasks}
        />
      )}
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