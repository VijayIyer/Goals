import { useContext, useState } from "react";
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { Task as TaskType } from "./taskTypes";

import ServicesContext from "./services/servicesProvider";
import { TaskServiceClientFactory } from "./services/taskServiceClientFactory";

import Tasks from "./components/tasks";
import AddTaskModal from "./components/addTaskModal";
import task from "./components/task";

const App = () => {
	const {serviceType} = useContext(ServicesContext);
	const service = new TaskServiceClientFactory(serviceType).getServiceClient();
	const [tasks, setTasks] = useState<Array<TaskType>>([]);
	const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
	const handleAddTaskButtonClick = () => {
    	setIsAddTaskModalOpen(true);
	}
  	const refreshTasks = async () => {
    	const tempTasks = await service.listTasks();
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
		<>
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
		</>	
	)

export default App;