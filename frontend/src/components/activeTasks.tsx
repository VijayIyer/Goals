import React, { ChangeEvent, useState } from 'react';
import { Button, FormControl, Grid2 as Grid, MenuItem, TextField, Typography } from '@mui/material';
import Task from './common/task';
import { Task as TaskType, DateRange } from '../types';
import SelectedDateRangeDisplay from './common/selectDateRange/selectedDateRangeDisplay';

import { FilterBy, GroupBy } from '../enums';
import { getDateWeek } from '../utils/week';
import { getDefaultDateRange } from '../utils/date';
import { filterTasks } from '../utils/tasks';
import { useLocation } from 'react-router-dom';
import SortByButton from './common/sortBy/sortByButton';

type TasksProps = {
    tasks: Array<TaskType>;
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
};

interface GroupedTasksType {
    range: string;
    tasks: Array<TaskType>;
}

function getRangeForDate(deadline: Date, groupBy: GroupBy): string {
    switch (groupBy) {
        case GroupBy.DAY: {
            return deadline.toLocaleDateString();
        }
        case GroupBy.WEEK: {
            return getDateWeek(deadline).toString();
        }
        case GroupBy.MONTH: {
            return deadline.toLocaleString('default', { month: 'long' });
        }
        case GroupBy.YEAR: {
            return deadline.getFullYear().toString();
        }
        default: {
            return deadline.toLocaleDateString();
        }
    }
}

interface LocationState {
    dateRange: DateRange;
}

function groupTasks(tasks: Array<TaskType>, groupBy: GroupBy) {
    const groupedTasks: Array<GroupedTasksType> = [];
    tasks.forEach(task => {
        const groupIndex: number = groupedTasks.findIndex(
            group => group.range === getRangeForDate(task.deadline, groupBy),
        );
        if (groupIndex == -1) {
            groupedTasks.push({
                range: getRangeForDate(task.deadline, groupBy),
                tasks: [task],
            });
        } else {
            groupedTasks[groupIndex].tasks.push(task);
        }
    });
    return groupedTasks;
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
    const filteredTasks: Array<TaskType> = filterTasks(tasks, dateRange);
    const groupedTasks = groupTasks(showAllTasks ? tasks : filteredTasks, groupBy);

    const handleGroupByChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroupBy(event.target.value as GroupBy);
    };
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                {showAllTasks && <Typography>Viewing All Tasks</Typography>}
                <Button onClick={() => setShowAllTasks(value => !value)}>
                    {!showAllTasks && 'View all tasks'}
                    {showAllTasks && 'View Filtered Tasks'}
                </Button>
            </div>
            {!showAllTasks && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <SelectedDateRangeDisplay
                            selectedDateRange={dateRange}
                            onDateRangeUpdated={(updatedDateRange: DateRange) => setDateRange(updatedDateRange)}
                        />
                        <SortByButton onSortBySelection={setSortBy} sortBy={sortBy} />
                        <FormControl sx={{ minWidth: 120 }}>
                            <TextField value={groupBy} onChange={handleGroupByChange} label="Group By" select>
                                {Object.values(GroupBy).map(value => (
                                    <MenuItem value={value}>{value}</MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </div>
                </>
            )}
            {groupedTasks.map(group => {
                return (
                    <Grid
                        key={group.range}
                        container
                        flexDirection={'column'}
                        style={{
                            marginBottom: '2em',
                            textAlign: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* Decide how to show for different groups */}
                        <Typography variant="h5">
                            {groupBy === GroupBy.WEEK ? `Week ${group.range}` : `${group.range}`}
                        </Typography>
                        <Grid key={group.range} container flexWrap="wrap" gap="2em">
                            {group.tasks.map(task => (
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
