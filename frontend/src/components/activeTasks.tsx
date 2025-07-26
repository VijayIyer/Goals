import { ChangeEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Button, FormControl, Grid2 as Grid, MenuItem, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { FilterBy, GroupBy } from '../enums';
import { GroupedTasksType } from '../interfaces';
import { Task as TaskType, DateRange, CompletionInfo } from '../types';

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

type TasksProps = {
    tasks: Array<TaskType>;
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
};

interface LocationState {
    dateRange: DateRange;
}

function getCompletionInfo(filteredTasks: Array<TaskType>) {
    return {
        total: filteredTasks.length,
        completed: filteredTasks.filter(task => task.completed === true).length,
    };
}
export default ({ tasks, onTaskEdited, onTaskDeleted }: TasksProps) => {
    const location = useLocation();
    const locationState = location.state as LocationState;
    const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.DAY);
    const [sortBy, setSortBy] = useState<string>('Date');
    const [showAllTasks, setShowAllTasks] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<DateRange>(
        locationState?.dateRange ?? getDefaultDateRange(FilterBy.DAY),
    );
    const filteredTasks: Array<TaskType> = filterTasksByDateRange(tasks, dateRange);
    const { total: totalNumberOfTasks, completed: totalNumberOfCompletedTasks }: CompletionInfo =
        getCompletionInfo(filteredTasks);
    const groupedTasks: GroupedTasksType = groupTasksByGroupByValue(showAllTasks ? tasks : filteredTasks, groupBy);

    const handleGroupByChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroupBy(event.target.value as GroupBy);
    };

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
                                    onTaskEdited={onTaskEdited}
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
