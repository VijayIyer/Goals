import { useContext, useEffect, useState } from 'react';

import { Button, Grid2 as Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import ServicesContext from '../services/servicesProvider';
import SelectedDateRangeDisplay from './common/selectDateRange/selectedDateRangeDisplay';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';
import { DateRange, Task, TasksByDay } from '../types';
import { getDefaultDateRange } from '../utils/date';
import { FilterBy } from '../enums';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
    summaryItem: {
        border: '1px solid',
        padding: '1em',
    },
});

function Dashboard({ tasks = [] }: { tasks: Array<Task> }) {
    const { serviceType } = useContext(ServicesContext);
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange(FilterBy.DAY));
    const [completionInfo, setCompletionInfo] = useState<Array<TasksByDay>>([]);

    const service = new TaskServiceClientFactory(serviceType).getServiceClient();

    useEffect(() => {
        async function getCompletionInfo() {
            const completionInfo = await service.getCompletionInfo(dateRange);
            setCompletionInfo(completionInfo);
        }
        getCompletionInfo();
    }, [tasks, dateRange]);

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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SelectedDateRangeDisplay
                    selectedDateRange={dateRange}
                    onDateRangeUpdated={(updatedDateRange: DateRange) => setDateRange(updatedDateRange)}
                />
            </div>
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
                                        <Button onClick={() => navigate('/', { state: { dateRange } })}>
                                            Go To Date
                                        </Button>
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
