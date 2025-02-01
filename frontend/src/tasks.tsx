import { Task as TaskType } from "./taskTypes";
import Task from "./task";

export default ({tasks}: {tasks: Array<TaskType>}) => {
    return (<>{tasks.map(task => <Task key={task.id} task={task} />)}</>)
}