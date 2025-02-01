import { Paper, Typography } from "@mui/material"

import { Task } from "./taskTypes";

export default ({task}: {task: Task}) => {
    return (
        <Paper key={task.id} style={{marginBottom: "2em"}}>
            <Typography>{task.title}</Typography>
            <Typography>{task.description}</Typography>
            <Typography>{String(task.deferred)}</Typography>
            <Typography>{`${task.deadline.getDate()}, ${task.deadline.getMonth()}, ${task.deadline.getFullYear()}`}</Typography>
        </Paper>
    )
}