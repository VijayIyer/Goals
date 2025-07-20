import React, { ChangeEvent, useState } from 'react';
import { Button, FormControl, Grid2 as Grid, MenuItem, TextField, Typography } from '@mui/material';
import Task from './common/task';
import { Task as TaskType, DateRange, CompletionInfo } from '../types';
import SelectedDateRangeDisplay from './common/selectDateRange/selectedDateRangeDisplay';

import { FilterBy, GroupBy } from '../enums';
import { getDefaultDateRange } from '../utils/date';
import { filterTasksByDateRange, groupTasks } from '../utils/tasks';
import { useLocation } from 'react-router-dom';
import SortByButton from './common/sortBy/sortByButton';
import { GroupedTasksType } from '../interfaces';

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
    const filteredTasksCompletionInfo: CompletionInfo = getCompletionInfo(filteredTasks);
    const groupedTasks: GroupedTasksType = groupTasks(showAllTasks ? tasks : filteredTasks, groupBy);

    const handleGroupByChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroupBy(event.target.value as GroupBy);
    };
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <div style={{ border: '1px solid', borderRadius: '1em', padding: '1em' }}>
                    <Typography style={{ fontWeight: 'bold' }}>Completed Tasks:</Typography>
                    <Typography>Total: {filteredTasksCompletionInfo.total}</Typography>
                    <Typography>Completed: {filteredTasksCompletionInfo.completed}</Typography>
                </div>
                {showAllTasks && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',

                            justifyContent: 'center',
                        }}
                    >
                        <Typography>Viewing All Tasks</Typography>
                        <Button onClick={() => setShowAllTasks(value => !value)}>View Filtered Tasks</Button>
                    </div>
                )}
                {!showAllTasks && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',

                            justifyContent: 'center',
                        }}
                    >
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
