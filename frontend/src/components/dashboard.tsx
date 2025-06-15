import { useContext, useEffect, useState } from 'react';

import { Button, Grid2 as Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import ServicesContext from '../services/servicesProvider';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';
import { Task, TasksByDay } from '../types';

const useStyles = makeStyles({
    summaryItem: {
        border: '1px solid',
        padding: '1em',
    },
});

function Dashboard({ tasks = [] }: { tasks: Array<Task> }) {
    const { serviceType } = useContext(ServicesContext);
    const [completionInfo, setCompletionInfo] = useState<Array<TasksByDay>>([]);

    const service = new TaskServiceClientFactory(serviceType).getServiceClient();

    useEffect(() => {
        async function getCompletionInfo() {
            const completionInfo = await service.getCompletionInfo();
            setCompletionInfo(completionInfo);
        }
        getCompletionInfo();
    }, [tasks]);

    const overAllCompleted = completionInfo.reduce((sum: number, taskByDay) => sum + taskByDay.totalCompleted, 0);
    const overall = completionInfo.reduce((sum: number, taskByDay) => sum + taskByDay.total, 0);

    const averageCompleted = !completionInfo.length
        ? 0
        : parseFloat(
              (
                  completionInfo.reduce((sum: number, taskByDay) => sum + taskByDay.totalCompleted, 0) /
                  completionInfo.length
              ).toFixed(2),
          );

    const averageTotal = !completionInfo.length
        ? 0
        : parseFloat(
              (
                  completionInfo.reduce((sum: number, taskByDay) => sum + taskByDay.total, 0) / completionInfo.length
              ).toFixed(2),
          );

    const maxCompleted = Math.max(...completionInfo.map(taskByDay => taskByDay.totalCompleted));

    const maxTotal = Math.max(...completionInfo.map(taskByDay => taskByDay.total));

    const minCompleted = Math.min(...completionInfo.map(taskByDay => taskByDay.totalCompleted));
    const minTotal = Math.min(...completionInfo.map(taskByDay => taskByDay.total));

    const classes = useStyles();

    return (
        <>
            <h1>This is the dashboard to see a summary of all tasks!</h1>
            <Grid container gap={1}>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>This the overall tasks completed</h3>
                        <h4>Completed: {overAllCompleted}</h4>
                        <h4>Total: {overall}</h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Average</h3>
                        <h4>Completed: {averageCompleted}</h4>
                        <h4>Total: {averageTotal}</h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Max</h3>
                        <h4>Completed: {maxCompleted}</h4>
                        <h4>Total: {maxTotal}</h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Min</h3>
                        <h4>Completed: {minCompleted}</h4>
                        <h4>Total: {minTotal}</h4>
                    </>
                </Grid>
                <Grid>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}
                    >
                        {completionInfo.map(taskByDay => {
                            return (
                                <>
                                    <div
                                        style={{
                                            border: '1px solid',
                                            padding: '1em',
                                        }}
                                    >
                                        {taskByDay.date} - {taskByDay.totalCompleted} / {taskByDay.total}
                                        <Button>Go To Date</Button>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
export default Dashboard;
