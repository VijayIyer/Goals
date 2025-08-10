import { ChangeEvent, useEffect, useState, useContext } from 'react';

import { Button, FormControl, Grid2 as Grid, MenuItem, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { FilterBy, GroupBy } from '../enums';
import { GroupedTasksType } from '../interfaces';
import { Task as TaskType, DateRange } from '../types';
import ServicesContext from '../services/servicesProvider';
import { TaskServiceClientFactory } from '../services/taskServiceClientFactory';

import { getDefaultDateRange } from '../utils/date';
import { filterTasksByDateRange, groupTasksByGroupByValue } from '../utils/tasks';

import SelectedDateRangeDisplay from './common/selectDateRange/selectedDateRangeDisplay';
import SortByButton from './common/sortBy/sortByButton';
import Task from './common/task';

const useStyles = makeStyles({
    gridContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
    },
    completionInfoContainer: {
        border: '1px solid',
        borderRadius: '1em',
        padding: '1em',
    },
    allTasksViewButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

// TODO: should these functions be promise void or just void
type ActiveTasksProps = {
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
};
export default ({ onTaskEdited, onTaskDeleted }: ActiveTasksProps) => {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [tasks, setTasks] = useState<Array<TaskType>>([]);
    const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.DAY);
    const [sortBy, setSortBy] = useState<string>('Date');
    const [showAllTasks, setShowAllTasks] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange(FilterBy.DAY));
    const filteredTasks: Array<TaskType> = filterTasksByDateRange(tasks, dateRange);
    const groupedTasks: GroupedTasksType = groupTasksByGroupByValue(showAllTasks ? tasks : filteredTasks, groupBy);

    const handleGroupByChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroupBy(event.target.value as GroupBy);
    };

    useEffect(() => {
        refreshTasks();
    }, [dateRange]);

    const refreshTasks = async () => {
        setTasks(
            await service.getTasks({
                dateRange,
                shouldBeActive: true,
            }),
        );
    };

    const refreshTask = async (taskId: number) => {
        const updatedTask = await service.getTaskById(taskId);
        const taskToUpdateIndex = tasks.findIndex(task => task.id === taskId);
        const newTasks = [...tasks];
        newTasks[taskToUpdateIndex] = updatedTask;
        setTasks(newTasks);
    };

    const handleTaskEdited = (editedTaskId: number) => {
        refreshTask(editedTaskId);
        // TODO: should ActiveTasks component know that this call is to be made?
        onTaskEdited(editedTaskId);
    };

    const totalNumberOfCompletedTasks = tasks.filter(task => task.completed === true).length;
    const totalNumberOfTasks = tasks.length;

    const classes = useStyles();

    return (
        <>
            <div className={classes.gridContainer}>
                <div className={classes.completionInfoContainer}>
                    <Typography style={{ fontWeight: 'bold' }}>Completed Tasks:</Typography>
                    <Typography style={{ fontWeight: 'bold' }}>(Selected Date Range)</Typography>
                    <Typography>Total: {totalNumberOfTasks}</Typography>
                    <Typography>Completed: {totalNumberOfCompletedTasks}</Typography>
                </div>
                {showAllTasks && (
                    <div className={classes.allTasksViewButtonContainer}>
                        <Typography>Viewing All Tasks</Typography>
                        <Button onClick={() => setShowAllTasks(value => !value)}>View Filtered Tasks</Button>
                    </div>
                )}
                {!showAllTasks && (
                    <div className={classes.allTasksViewButtonContainer}>
                        <SelectedDateRangeDisplay
                            selectedDateRange={dateRange}
                            onDateRangeUpdated={(updatedDateRange: DateRange) => setDateRange(updatedDateRange)}
                        />
                        <Button onClick={() => setShowAllTasks(value => !value)}>View all tasks</Button>
                    </div>
                )}
                <SortByButton onSortBySelection={setSortBy} sortBy={sortBy} />
                <FormControl sx={{ minWidth: 120 }}>
                    <TextField value={groupBy} onChange={handleGroupByChange} label="Group By" select>
                        {Object.values(GroupBy).map(value => (
                            <MenuItem key={value} value={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>
            </div>
            {Object.keys(groupedTasks).map(key => {
                return (
                    <Grid
                        key={key}
                        container
                        flexDirection={'column'}
                        style={{
                            marginBottom: '2em',
                            textAlign: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* Decide how to show for different groups */}
                        <Typography variant="h5">{key}</Typography>
                        <Grid key={key} container flexWrap="wrap" gap="2em">
                            {groupedTasks[key].map(task => (
                                <Task
                                    key={task.id}
                                    task={task}
                                    onTaskEdited={handleTaskEdited}
                                    onTaskDeleted={onTaskDeleted}
                                />
                            ))}
                        </Grid>
                    </Grid>
                );
            })}
        </>
    );
};
