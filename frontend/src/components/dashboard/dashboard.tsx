import { useContext, useEffect, useState } from 'react';

import { Button, Grid2 as Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import ServicesContext from '../../services/servicesProvider';
import SelectedDateRangeDisplay from '../common/selectDateRange/selectedDateRangeDisplay';
import { TaskServiceClientFactory } from '../../services/taskServiceClientFactory';
import { DateRange, Task, TasksByDay } from '../../types';
import { getDefaultDateRange, formatWeekDateRange, formatDate } from '../../utils/date';
import { FilterBy, GroupBy } from '../../enums';
import { useNavigate } from 'react-router-dom';
import { filterTasksByFilterBy, getGroupRange, groupTasksByGroupByValue } from '../../utils/tasks';
import { getDateWeek, getWeekEndDate, getWeekStartDate } from '../../utils/week';

import {
    GroupedTasksType,
    PerformanceInDateRange,
    RequiredSummaryItemDetails as RequiredSummaryItemData,
} from '../../interfaces';

import AddSummaryItemModal from './addSummaryItemModal';
import SummaryItem from './summaryItem';

const useStyles = makeStyles({
    summaryItem: {
        border: '1px solid',
        padding: '1em',
    },
});

function getPerformancesInDateRange(tasks: Array<Task>, filterBy: FilterBy, groupBy: GroupBy): PerformanceInDateRange {
    const currentDateRangeTasks: Array<Task> = filterTasksByFilterBy(tasks, filterBy);
    const groupedTasks: GroupedTasksType = groupTasksByGroupByValue(currentDateRangeTasks, groupBy);
    const groupedSummaryInCurrentDateRange = Object.keys(groupedTasks).map(key => {
        return {
            name: getGroupRange(key, groupBy),
            total: groupedTasks[key].length,
            completed: groupedTasks[key].filter(task => task.completed === true).length,
        };
    });
    const bestPerformingItem = groupedSummaryInCurrentDateRange.reduce(
        (prev, current) => {
            return !prev.name
                ? current
                : prev.completed / prev.total > current.completed / current.total
                  ? prev
                  : current;
        },
        { name: '', completed: 0, total: 1 },
    );
    const worstPerformingItem = groupedSummaryInCurrentDateRange.reduce(
        (prev, current) => {
            return !prev.name
                ? current
                : prev.completed / prev.total < current.completed / current.total
                  ? prev
                  : current;
        },
        { name: '', completed: 0, total: 1 },
    );
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

function SummaryGridItem({ title, children }: { title: string; children: React.ReactNode }) {
    const classes = useStyles();
    return (
        <Grid className={classes.summaryItem} columns={3}>
            <h3 style={{ wordBreak: 'break-word' }}>{title}</h3>
            {children}
        </Grid>
    );
}

function Dashboard({ tasks = [] }: { tasks: Array<Task> }) {
    const { serviceType } = useContext(ServicesContext);
    const navigate = useNavigate();
    const [summaryItems, setSummaryItems] = useState<Array<RequiredSummaryItemData>>([]);
    const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange(FilterBy.DAY));
    const [showAddSummaryItemModal, setShowAddSummaryItemModal] = useState(false);
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

    const handleAddSummaryItemClick = () => {
        setShowAddSummaryItemModal(true);
    };

    const handleAddSummaryItemSelection = (newSummaryItem: RequiredSummaryItemData) => {
        setSummaryItems([...summaryItems, newSummaryItem]);
    };

    const overAllCompleted = tasks.filter(task => task.completed === true).length;
    const overall = tasks.length;

    const tasksInCurrentYear = tasks.filter(task => task.deadline.getFullYear() === new Date().getFullYear());
    const tasksInCurrentMonth = tasks.filter(
        task =>
            task.deadline.toLocaleString('default', { month: 'long' }) ===
                new Date().toLocaleString('default', { month: 'long' }) &&
            task.deadline.getFullYear() === new Date().getFullYear(),
    );
    const tasksInCurrentWeek = tasks.filter(task => {
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
    });
    const todayTasks = tasks.filter(task => {
        const currentDate = new Date();
        const currentTaskDate = task.deadline;
        currentTaskDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return currentTaskDate === currentDate;
    });

    const currentYearMonthPerformances = getPerformancesInDateRange(tasks, FilterBy.YEAR, GroupBy.MONTH);
    const currentYearWeekPerformances = getPerformancesInDateRange(tasks, FilterBy.YEAR, GroupBy.WEEK);
    const currentYearDayPerformances = getPerformancesInDateRange(tasks, FilterBy.YEAR, GroupBy.DAY);

    const currentMonthWeekPerformances = getPerformancesInDateRange(tasks, FilterBy.MONTH, GroupBy.WEEK);
    const currentMonthDayPerformances = getPerformancesInDateRange(tasks, FilterBy.MONTH, GroupBy.DAY);

    const currentWeekDayPerformances = getPerformancesInDateRange(tasks, FilterBy.WEEK, GroupBy.DAY);

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
                <Button onClick={handleAddSummaryItemClick}>Add Summary Item</Button>
                {showAddSummaryItemModal && (
                    <AddSummaryItemModal
                        isOpen={showAddSummaryItemModal}
                        onClose={() => setShowAddSummaryItemModal(false)}
                        onAddSummaryItemSelection={handleAddSummaryItemSelection}
                    />
                )}
            </div>
            <Grid container gap={2} wrap="wrap">
                {summaryItems.map(summaryItem => (
                    <SummaryItem key={summaryItem.title} tasks={tasks} summaryItem={summaryItem} />
                ))}
                <SummaryGridItem title="Overall">
                    <>
                        <h4>Total: {overall}</h4>
                        <h4>Completed: {overAllCompleted}</h4>
                    </>
                </SummaryGridItem>
                <SummaryGridItem title={`Current Year (${new Date().getFullYear()})`}>
                    <>
                        <h4>Total: {tasksInCurrentYear.length}</h4>
                        <h4>Completed: {tasksInCurrentYear.filter(task => task.completed === true).length}</h4>
                    </>
                </SummaryGridItem>
                <SummaryGridItem
                    title={`Current Month (${new Date().toLocaleString('default', { month: 'long' })}, ${new Date().getFullYear()})`}
                >
                    <>
                        <h4>Total: {tasksInCurrentMonth.length}</h4>
                        <h4>Completed: {tasksInCurrentMonth.filter(task => task.completed === true).length}</h4>
                    </>
                </SummaryGridItem>

                <SummaryGridItem
                    title={`Current Week (${formatWeekDateRange(getDateWeek(new Date()), new Date().getFullYear())})`}
                >
                    <>
                        <h4>Total: {tasksInCurrentWeek.length}</h4>
                        <h4>Completed: {tasksInCurrentWeek.filter(task => task.completed === true).length}</h4>
                    </>
                </SummaryGridItem>
                <SummaryGridItem title={`Today (${formatDate(new Date())})`}>
                    <>
                        <h4>Total: {todayTasks.length}</h4>
                        <h4>Completed: {todayTasks.filter(task => task.completed === true).length}</h4>
                    </>
                </SummaryGridItem>
                <SummaryGridItem title={`Best Month (${currentYearMonthPerformances.best.name})`}>
                    <h4>
                        Completion %: {(currentYearMonthPerformances.best.completionPercentage * 100).toFixed(2)} (
                        {currentYearMonthPerformances.best.completed} / {currentYearMonthPerformances.best.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Worst Month (${currentYearMonthPerformances.worst.name})`}>
                    <h4>
                        Completion %: {(currentYearMonthPerformances.worst.completionPercentage * 100).toFixed(2)} (
                        {currentYearMonthPerformances.worst.completed} / {currentYearMonthPerformances.worst.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Best Week (${currentYearWeekPerformances.best.name})`}>
                    <h4>
                        Completion %: {(currentYearWeekPerformances.best.completionPercentage * 100).toFixed(2)} (
                        {currentYearWeekPerformances.best.completed} / {currentYearWeekPerformances.best.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Worst Week (${currentYearWeekPerformances.worst.name})`}>
                    <h4>
                        Completion %: {(currentYearWeekPerformances.worst.completionPercentage * 100).toFixed(2)} (
                        {currentYearWeekPerformances.worst.completed} / {currentYearWeekPerformances.worst.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Best Day (${currentYearDayPerformances.best.name})`}>
                    <h4>
                        Completion %: {(currentYearDayPerformances.best.completionPercentage * 100).toFixed(2)} (
                        {currentYearDayPerformances.best.completed} / {currentYearDayPerformances.best.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Worst Day (${currentYearDayPerformances.worst.name})`}>
                    <h4>
                        Completion %: {(currentYearDayPerformances.worst.completionPercentage * 100).toFixed(2)} (
                        {currentYearDayPerformances.worst.completed} / {currentYearDayPerformances.worst.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Best Week (${currentMonthWeekPerformances.best.name})`}>
                    <h4>
                        Completion %: {(currentMonthWeekPerformances.best.completionPercentage * 100).toFixed(2)} (
                        {currentMonthWeekPerformances.best.completed} / {currentMonthWeekPerformances.best.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Worst Week (${currentMonthWeekPerformances.worst.name})`}>
                    <h4>
                        Completion %: {(currentMonthWeekPerformances.worst.completionPercentage * 100).toFixed(2)} (
                        {currentMonthWeekPerformances.worst.completed} / {currentMonthWeekPerformances.worst.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Best Day (${currentMonthDayPerformances.best.name})`}>
                    <h4>
                        Completion %: {(currentMonthDayPerformances.best.completionPercentage * 100).toFixed(2)} (
                        {currentMonthDayPerformances.best.completed} / {currentMonthDayPerformances.best.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Worst Day (${currentMonthDayPerformances.worst.name})`}>
                    <h4>
                        Completion %: {(currentMonthDayPerformances.worst.completionPercentage * 100).toFixed(2)} (
                        {currentMonthDayPerformances.worst.completed} / {currentMonthDayPerformances.worst.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Best Day (${currentWeekDayPerformances.best.name})`}>
                    <h4>
                        Completion %: {(currentWeekDayPerformances.best.completionPercentage * 100).toFixed(2)} (
                        {currentWeekDayPerformances.best.completed} / {currentWeekDayPerformances.best.total})
                    </h4>
                </SummaryGridItem>
                <SummaryGridItem title={`Worst Day (${currentWeekDayPerformances.worst.name})`}>
                    <h4>
                        Completion %: {(currentWeekDayPerformances.worst.completionPercentage * 100).toFixed(2)} (
                        {currentWeekDayPerformances.worst.completed} / {currentWeekDayPerformances.worst.total})
                    </h4>
                </SummaryGridItem>
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
