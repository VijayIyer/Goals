import { useContext, useEffect, useState } from 'react';

import { Button, Grid2 as Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import ServicesContext from '../services/servicesProvider';
import SelectedDateRangeDisplay from './common/selectDateRange/selectedDateRangeDisplay';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';
import { DateRange, Task, TasksByDay } from '../types';
import { getDefaultDateRange, formatWeekDateRange, formatDate } from '../utils/date';
import { FilterBy, GroupBy } from '../enums';
import { useNavigate } from 'react-router-dom';
import { filterTasksByFilterBy, groupTasks } from '../utils/tasks';
import { getDateWeek, getWeekEndDate, getWeekStartDate } from '../utils/week';
import { GroupedTasksType } from '../interfaces/task';

const useStyles = makeStyles({
    summaryItem: {
        border: '1px solid',
        padding: '1em',
    },
});

function getGroupRange(group: GroupedTasksType, groupBy: GroupBy) {
    switch (groupBy) {
        case GroupBy.WEEK: {
            const currentYear = new Date().getFullYear();
            const weekNumber = getDateWeek(new Date());
            return formatWeekDateRange(weekNumber, currentYear);
        }
        case GroupBy.MONTH: {
            const currentYear = new Date().getFullYear();
            return `${group.range}, ${currentYear}`;
        }
        case GroupBy.DAY: {
            return group.range;
        }
        default:
            return group.range;
    }
}

function getPerformancesInDateRange(tasks: Array<Task>, filterBy: FilterBy, groupBy: GroupBy) {
    const currentDateRangeTasks = filterTasksByFilterBy(tasks, filterBy);
    const groupedTasks = groupTasks(currentDateRangeTasks, groupBy);
    const groupedSummaryInCurrentDateRange = groupedTasks.map(group => {
        return {
            name: getGroupRange(group, groupBy),
            total: group.tasks.length,
            completed: group.tasks.filter(task => task.completed === true).length,
        };
    });
    const bestPerformingItem = groupedSummaryInCurrentDateRange.reduce((prev, current) => {
        return prev.completed / prev.total > current.completed / current.total ? prev : current;
    });
    const worstPerformingItem = groupedSummaryInCurrentDateRange.reduce((prev, current) => {
        return prev.completed / prev.total < current.completed / current.total ? prev : current;
    });
    return {
        best: {
            name: bestPerformingItem.name,
            completed: bestPerformingItem.completed,
            total: bestPerformingItem.total,
            completionPercentage: bestPerformingItem.total
                ? bestPerformingItem.completed / bestPerformingItem.total
                : bestPerformingItem.completed / 1,
        },
        worst: {
            name: worstPerformingItem.name,
            completed: worstPerformingItem.completed,
            total: worstPerformingItem.total,
            completionPercentage: worstPerformingItem.total
                ? worstPerformingItem.completed / worstPerformingItem.total
                : worstPerformingItem.completed / 1,
        },
    };
}

function SummaryStatsItemDisplay({
    currentDateRangePerformance,
}: {
    currentDateRangePerformance: {
        name: string;
        completed: number;
        total: number;
        completionPercentage: number;
    };
}) {
    return (
        <>
            {(currentDateRangePerformance.completionPercentage * 100).toFixed(2)} ({currentDateRangePerformance.name}{' '}
            {currentDateRangePerformance.completed} / {currentDateRangePerformance.total})
        </>
    );
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

    const monthCompleted = tasks
        .filter(
            task =>
                task.deadline.toLocaleString('default', { month: 'long' }) ===
                new Date().toLocaleString('default', { month: 'long' }),
        )
        .reduce((sum: number, task) => sum + (task.completed ? 1 : 0), 0);
    const monthTotal = tasks.filter(
        task =>
            task.deadline.toLocaleString('default', { month: 'long' }) ===
            new Date().toLocaleString('default', { month: 'long' }),
    ).length;

    const weekCompleted = tasks
        .filter(task => {
            const currentDate = new Date();
            const weekNumber = getDateWeek(currentDate);
            const currentYear = new Date().getFullYear();
            const taskDate = new Date(task.deadline);
            const currentWeekStartDate = getWeekStartDate(weekNumber, currentYear);
            const currentWeekEndDate = getWeekEndDate(weekNumber, currentYear);
            taskDate.setHours(0, 0, 0, 0);
            currentWeekStartDate.setHours(0, 0, 0, 0);
            currentWeekEndDate.setHours(0, 0, 0, 0);
            return taskDate >= currentWeekStartDate && (currentWeekEndDate ? taskDate <= currentWeekEndDate : true);
        })
        .reduce((sum: number, task) => sum + (task.completed ? 1 : 0), 0);
    const weekTotal = tasks.filter(task => {
        const currentDate = new Date();
        const weekNumber = getDateWeek(currentDate);
        const currentYear = new Date().getFullYear();
        const taskDate = new Date(task.deadline);
        const currentWeekStartDate = getWeekStartDate(weekNumber, currentYear);
        const currentWeekEndDate = getWeekEndDate(weekNumber, currentYear);
        taskDate.setHours(0, 0, 0, 0);
        currentWeekStartDate.setHours(0, 0, 0, 0);
        currentWeekEndDate.setHours(0, 0, 0, 0);
        return taskDate >= currentWeekStartDate && (currentWeekEndDate ? taskDate <= currentWeekEndDate : true);
    }).length;

    const dayTotal = tasks.filter(task => {
        const currentDate = new Date();
        const currentTaskDate = task.deadline;
        currentTaskDate.setHours(0, 0, 0, 0);
        return currentTaskDate === currentDate;
    }).length;
    const dayCompleted = tasks
        .filter(task => {
            const currentDate = new Date();
            const currentTaskDate = task.deadline;
            currentTaskDate.setHours(0, 0, 0, 0);
            return currentTaskDate === currentDate;
        })
        .reduce((sum: number, task) => sum + (task.completed ? 1 : 0), 0);

    const currentYearMonthPerformances = getPerformancesInDateRange(tasks, FilterBy.YEAR, GroupBy.MONTH);
    const currentYearWeekPerformances = getPerformancesInDateRange(tasks, FilterBy.YEAR, GroupBy.WEEK);
    const currentYearDayPerformances = getPerformancesInDateRange(tasks, FilterBy.YEAR, GroupBy.DAY);

    const currentMonthWeekPerformances = getPerformancesInDateRange(tasks, FilterBy.MONTH, GroupBy.WEEK);
    const currentMonthDayPerformances = getPerformancesInDateRange(tasks, FilterBy.MONTH, GroupBy.DAY);

    const currentWeekDayPerformances = getPerformancesInDateRange(tasks, FilterBy.WEEK, GroupBy.DAY);

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
                        <h3>Current Year ({new Date().getFullYear()})</h3>
                        <h4>Total: {yearTotal}</h4>
                        <h4>Completed: {yearCompleted}</h4>
                        <h4>
                            Best Month (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentYearMonthPerformances.best} />
                        </h4>
                        <h4>
                            Worst Month (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentYearMonthPerformances.worst} />
                        </h4>
                        <h4>
                            Best Week (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentYearWeekPerformances.best} />
                        </h4>
                        <h4>
                            Worst Week (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentYearWeekPerformances.worst} />
                        </h4>
                        <h4>
                            Best Day (%):
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentYearDayPerformances.best} />
                        </h4>
                        <h4>
                            Worst Day (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentYearDayPerformances.worst} />
                        </h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>
                            Current Month ({new Date().toLocaleString('default', { month: 'long' })},{' '}
                            {new Date().getFullYear()})
                        </h3>
                        <h4>Total: {monthTotal}</h4>
                        <h4>Completed: {monthCompleted}</h4>
                        <h4>
                            Best Week (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentMonthWeekPerformances.best} />
                        </h4>
                        <h4>
                            Worst Week (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentMonthWeekPerformances.worst} />
                        </h4>
                        <h4>
                            Best Day (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentMonthDayPerformances.best} />
                        </h4>
                        <h4>
                            Worst Day (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentMonthDayPerformances.worst} />
                        </h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>
                            Current Week ({formatWeekDateRange(getDateWeek(new Date()), new Date().getFullYear())},
                            {new Date().getFullYear()})
                        </h3>
                        <h4>Total: {weekTotal}</h4>
                        <h4>Completed: {weekCompleted}</h4>
                        <h4>
                            Best Day (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentWeekDayPerformances.best} />
                        </h4>
                        <h4>
                            Worst Day (%):{' '}
                            <SummaryStatsItemDisplay currentDateRangePerformance={currentWeekDayPerformances.worst} />
                        </h4>
                    </>
                </Grid>
                <Grid className={classes.summaryItem}>
                    <>
                        <h3>Day ({formatDate(new Date())})</h3>
                        <h4>Total: {dayTotal}</h4>
                        <h4>Completed: {dayCompleted}</h4>
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
