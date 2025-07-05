import { useContext, useEffect, useState } from 'react';

import { Button, Grid2 as Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import ServicesContext from '../services/servicesProvider';
import SelectedDateRangeDisplay from './common/selectDateRange/selectedDateRangeDisplay';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';
import { DateRange, Task, TasksByDay } from '../types';
import { getDefaultDateRange } from '../utils/date';
import { FilterBy, GroupBy } from '../enums';
import { useNavigate } from 'react-router-dom';
import { groupTasks } from '../utils/tasks';

const useStyles = makeStyles({
    summaryItem: {
        border: '1px solid',
        padding: '1em',
    },
});

function getMonthPerformancesInCurrentYear(tasks: Array<Task>) {
    const currentYearTasks = tasks.filter(task => task.deadline.getFullYear() === new Date().getFullYear());
    const groupedTasksInCurrentYear = groupTasks(currentYearTasks, GroupBy.MONTH);
    const perMonthSummaryInCurrentYear = groupedTasksInCurrentYear.map(group => {
        return {
            name: group.range,
            total: group.tasks.length,
            completed: group.tasks.filter(task => task.completed === true).length,
        };
    });
    const bestMonth = perMonthSummaryInCurrentYear.reduce((prev, current) => {
        return prev.completed / prev.total > current.completed / current.total ? prev : current;
    });
    const worstMonth = perMonthSummaryInCurrentYear.reduce((prev, current) => {
        return prev.completed / prev.total < current.completed / current.total ? prev : current;
    });
    return {
        best: {
            name: bestMonth.name,
            completed: bestMonth.completed,
            total: bestMonth.total,
            completionPercentage: bestMonth.completed / bestMonth.total,
        },
        worst: {
            name: worstMonth.name,
            completed: worstMonth.completed,
            total: worstMonth.total,
            completionPercentage: worstMonth.completed / worstMonth.total,
        },
    };
}

function Dashboard({ tasks = [] }: { tasks: Array<Task> }) {
    const { serviceType } = useContext(ServicesContext);
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange(FilterBy.DAY));
    const [completionInfo, setCompletionInfo] = useState<Array<TasksByDay>>([]);
    const [showAllTasks, setShowAllTasks] = useState<boolean>(false);

    const service = new TaskServiceClientFactory(serviceType).getServiceClient();

    useEffect(() => {
        async function getCompletionInfo() {
            const completionInfo = await service.getCompletionInfo(dateRange, showAllTasks);
            setCompletionInfo(completionInfo);
        }
        getCompletionInfo();
    }, [tasks, dateRange]);

    const overAllCompleted = tasks.reduce((sum: number, task) => sum + (task.completed ? 1 : 0), 0);
    const overall = tasks.length;

    const yearCompleted = tasks
        .filter(task => task.deadline.getFullYear() === new Date().getFullYear())
        .reduce((sum: number, task) => sum + (task.completed ? 1 : 0), 0);
    const yearTotal = tasks.filter(task => task.deadline.getFullYear() === new Date().getFullYear()).length;

    const currentYearMonthPerformance = getMonthPerformancesInCurrentYear(tasks);

    const classes = useStyles();

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {!showAllTasks && (
                    <>
                        <SelectedDateRangeDisplay
                            selectedDateRange={dateRange}
                            onDateRangeUpdated={(updatedDateRange: DateRange) => setDateRange(updatedDateRange)}
                        />
                    </>
                )}
                <Button onClick={() => setShowAllTasks(value => !value)}>
                    {showAllTasks ? 'Show summary for all tasks' : 'Show summary for selected date range'}
                </Button>
            </div>
            <Grid container gap={1}>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Overall</h3>
                        <h4>Total: {overall}</h4>
                        <h4>Completed: {overAllCompleted}</h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Year ({new Date().getFullYear()})</h3>
                        <h4>Total: {yearTotal}</h4>
                        <h4>Completed: {yearCompleted}</h4>
                        <h4>
                            Best Month (%): {(currentYearMonthPerformance.best.completionPercentage * 100).toFixed(2)} (
                            {currentYearMonthPerformance.best.name} {currentYearMonthPerformance.best.completed} /{' '}
                            {currentYearMonthPerformance.best.total})
                        </h4>
                        <h4>
                            Worst Month (%): {(currentYearMonthPerformance.worst.completionPercentage * 100).toFixed(2)}
                            ({currentYearMonthPerformance.worst.name} {currentYearMonthPerformance.worst.completed} /{' '}
                            {currentYearMonthPerformance.worst.total})
                        </h4>
                        <h4>Best Week (%):</h4>
                        <h4>Worst Week (%):</h4>
                        <h4>Best Day (%):</h4>
                        <h4>Worst Day (%):</h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Month</h3>
                        <h4>Total: </h4>
                        <h4>Completed: </h4>
                        <h4>Best Week (%):</h4>
                        <h4>Best Day (%):</h4>
                        <h4>Worst Week (%):</h4>
                        <h4>Worst Day (%):</h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Week</h3>
                        <h4>Total: </h4>
                        <h4>Completed: </h4>
                        <h4>Best Day (%):</h4>
                        <h4>Worst Day (%):</h4>
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
