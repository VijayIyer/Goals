import React, { ChangeEvent, useState } from 'react';
import { Button, FormControl, Grid2 as Grid, MenuItem, TextField, Typography } from '@mui/material';

import Task from './common/task';
import { Task as TaskType, DateRange } from '../types';
import SelectedDateRangeDisplay from './common/selectDateRange/selectedDateRangeDisplay';

import { GROUP_BY } from '../enums';
import { getDateWeek } from '../utils/week';

type TasksProps = {
    tasks: Array<TaskType>;
    onTaskEdited: (id: number) => Promise<void>;
    onTaskDeleted: () => Promise<void>;
};

interface GroupedTasksType {
    range: string;
    tasks: Array<TaskType>;
}

function getDefaultDateRange(): DateRange {
    const today = new Date();
    return {
        startDate: today,
        week: getDateWeek(today),
        month: today.toLocaleString('default', { month: 'long' }),
        year: today.getFullYear(),
        groupBy: GROUP_BY.DAY, // should this be here or part of a separate value
    };
}
function toRange(deadline: Date, groupBy: GROUP_BY): string {
    switch (groupBy) {
        case GROUP_BY.DAY: {
            return deadline.toLocaleDateString();
        }
        case GROUP_BY.WEEK: {
            return getDateWeek(deadline).toString();
        }
        case GROUP_BY.MONTH: {
            return deadline.toLocaleString('default', { month: 'long' });
        }
        case GROUP_BY.YEAR: {
            return deadline.getFullYear().toString();
        }
        default: {
            return deadline.toLocaleDateString();
        }
    }
}

function groupTasks(tasks: Array<TaskType>, groupBy: GROUP_BY) {
    const groupedTasks: Array<GroupedTasksType> = [];
    tasks.forEach(task => {
        const groupIndex: number = groupedTasks.findIndex(group => group.range === toRange(task.deadline, groupBy));
        if (groupIndex == -1) {
            groupedTasks.push({
                range: toRange(task.deadline, groupBy),
                tasks: [task],
            });
        } else {
            groupedTasks[groupIndex].tasks.push(task);
        }
    });
    return groupedTasks;
}

function filterTasks(tasks: Array<TaskType>, dateRange: DateRange): Array<TaskType> {
    if (dateRange.groupBy === GROUP_BY.DAY) {
        return tasks.filter(task => task.deadline.toDateString() === dateRange.startDate.toDateString());
    }
    if (dateRange.groupBy === GROUP_BY.WEEK || dateRange.groupBy === GROUP_BY.CUSTOM) {
        return tasks.filter(
            task =>
                task.deadline >= dateRange.startDate &&
                (dateRange.endDate ? task.deadline <= dateRange?.endDate : true),
        );
    }
    if (dateRange.groupBy === GROUP_BY.MONTH) {
        return tasks.filter(
            task =>
                task.deadline.getFullYear() === dateRange.year &&
                task.deadline.toLocaleString('default', { month: 'long' }) === dateRange.month,
        );
    }
    if (dateRange.groupBy === GROUP_BY.YEAR) {
        return tasks.filter(task => task.deadline.getFullYear() === dateRange.year);
    }
    return tasks;
}

export default ({ tasks, onTaskEdited, onTaskDeleted }: TasksProps) => {
    const [groupBy, setGroupBy] = useState<GROUP_BY>(GROUP_BY.DAY);
    const [showAllTasks, setShowAllTasks] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
    const filteredTasks: Array<TaskType> = filterTasks(tasks, dateRange);
    const groupedTasks = groupTasks(showAllTasks ? tasks : filteredTasks, groupBy);

    console.log(dateRange.startDate);
    console.log(JSON.stringify(filteredTasks));

    const handleGroupByChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroupBy(event.target.value as GROUP_BY);
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SelectedDateRangeDisplay
                        selectedDateRange={dateRange}
                        onDateRangeUpdated={(updatedDateRange: DateRange) => setDateRange(updatedDateRange)}
                    />
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <TextField value={groupBy} onChange={handleGroupByChange} label="Group By" select>
                        <MenuItem value={GROUP_BY.DAY}>{GROUP_BY.DAY}</MenuItem>
                        <MenuItem value={GROUP_BY.WEEK}>{GROUP_BY.WEEK}</MenuItem>
                        <MenuItem value={GROUP_BY.MONTH}>{GROUP_BY.MONTH}</MenuItem>
                        <MenuItem value={GROUP_BY.YEAR}>{GROUP_BY.YEAR}</MenuItem>
                    </TextField>
                </FormControl>
            </div>
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
                            {groupBy === GROUP_BY.WEEK ? `Week ${group.range}` : `${group.range}`}
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
