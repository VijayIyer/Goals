import { Task as TaskType } from "../taskTypes"

import Task from "./task";

type TasksProps =  {
    tasks: Array<TaskType>,
    onTaskEdited: () => Promise<void>,
    onTaskDeleted: () => Promise<void>
}
export default ({tasks, onTaskEdited, onTaskDeleted}: TasksProps) => {
    return (<>{tasks.map(task => <Task key={task.id} task={task} onTaskEdited={onTaskEdited} onTaskDeleted={onTaskDeleted} />)}</>)
}