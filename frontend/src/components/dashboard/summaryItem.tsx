import { useMemo } from 'react';
import { GroupedTasksType, RequiredSummaryItemDetails } from '../../interfaces';

import { Grid2 as Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Completed, Percentage, Task } from '../../types';
import {
    filterTasksByDateRange,
    getGroupRange,
    groupTasks,
    getSummaryItemNameFromStatPeriodAndType,
} from '../../utils';
import { GroupBy, RequiredStatType } from '../../enums';

const useStyles = makeStyles({
    summaryItem: {
        border: '1px solid',
        padding: '1em',
    },
});

function getBestPerformingTaskGroupWithStat(
    groupedTasksWithStat: Array<TaskGroupWithStat>,
    statType: RequiredStatType,
): TaskGroupWithStat {
    const bestPerformingItem = groupedTasksWithStat.reduce(
        (prev, current) => {
            switch (statType) {
                case RequiredStatType.BEST_COMPLETION_PERCENTAGE: {
                    return !prev.key
                        ? current
                        : prev.stat.completed / prev.stat.total > current.stat.completed / current.stat.total
                          ? prev
                          : current;
                }
                case RequiredStatType.WORST_COMPLETION_PERCENTAGE: {
                    return !prev.key
                        ? current
                        : prev.stat.completed / prev.stat.total < current.stat.completed / current.stat.total
                          ? prev
                          : current;
                }
                case RequiredStatType.LEAST_COMPLETED: {
                    return !prev.key ? current : prev.stat.completed < current.stat.completed ? prev : current;
                }
                case RequiredStatType.MOST_COMPLETED: {
                    return !prev.key ? current : prev.stat.completed > current.stat.completed ? prev : current;
                }
                default:
                    return !prev.key
                        ? current
                        : prev.stat.completed / prev.stat.total > current.stat.completed / current.stat.total
                          ? prev
                          : current;
            }
        },
        { key: '', stat: { total: 1, completed: 0, percentage: 0 } } as { key: string; stat: Percentage | Completed },
    );
    return {
        key: bestPerformingItem.key,
        stat: {
            percentage: (bestPerformingItem.stat.completed / bestPerformingItem.stat.total) * 100,
            completed: bestPerformingItem.stat.completed,
            total: bestPerformingItem.stat.total,
        },
    };
}

interface TaskGroupWithStat {
    key: string;
    stat: Percentage | Completed;
}
function getTaskGroupsWithStat(
    groupedTasks: GroupedTasksType,
    statType: RequiredStatType,
    statPeriod: GroupBy,
): Array<TaskGroupWithStat> {
    return Object.keys(groupedTasks).map(groupKey => {
        const total = groupedTasks[groupKey].length;
        const completed = groupedTasks[groupKey].filter(task => task.completed === true).length;
        return {
            key: getGroupRange(groupKey, statPeriod),
            stat: {
                total,
                completed,
                ...([
                    RequiredStatType.BEST_COMPLETION_PERCENTAGE,
                    RequiredStatType.WORST_COMPLETION_PERCENTAGE,
                ].includes(statType) && { percentage: (completed / total) * 100 }),
            },
        };
    });
}
interface RequiredStat {
    name: string;
    stat: Percentage | Completed;
    period?: GroupBy;
}
function getRequiredStat(
    groupedTasksWithStat: Array<TaskGroupWithStat>,
    statType: RequiredStatType,
    statPeriod: GroupBy,
): RequiredStat | null {
    const { key, stat } = getBestPerformingTaskGroupWithStat(groupedTasksWithStat, statType);
    return {
        name: key,
        stat,
        period: statPeriod,
    };
}
interface SummaryItemProps {
    tasks: Array<Task>;
    summaryItem: RequiredSummaryItemDetails;
}
export default function SummaryItem({ tasks, summaryItem }: SummaryItemProps) {
    const classes = useStyles();
    const filteredTasks: Array<Task> = useMemo(
        () => filterTasksByDateRange(tasks, summaryItem.dateRange),
        [tasks, summaryItem.dateRange],
    );
    const groupedTasks: GroupedTasksType = useMemo(
        () => groupTasks(filteredTasks, summaryItem.statPeriod),
        [tasks, summaryItem.statPeriod],
    );
    console.log(`groupedTasks - ${JSON.stringify(groupedTasks, null, 2)}`);
    const groupedTasksWithStat: Array<TaskGroupWithStat> = getTaskGroupsWithStat(
        groupedTasks,
        summaryItem.statType,
        summaryItem.statPeriod,
    );
    console.log(`groupedTasksWithStat - ${JSON.stringify(groupedTasksWithStat, null, 2)}`);
    const requiredStat: RequiredStat | null =
        groupedTasksWithStat.length > 0
            ? getRequiredStat(groupedTasksWithStat, summaryItem.statType, summaryItem.statPeriod)
            : null;
    if (!requiredStat) {
        return <Grid className={classes.summaryItem}>There are no stats for this period!</Grid>;
    }
    return (
        <Grid className={classes.summaryItem}>
            <h3 style={{ wordBreak: 'break-word' }}>{summaryItem.title}</h3>
            {(summaryItem.statType === RequiredStatType.BEST_COMPLETION_PERCENTAGE ||
                summaryItem.statType === RequiredStatType.WORST_COMPLETION_PERCENTAGE) && (
                <>
                    <h4>
                        {requiredStat.name
                            ? requiredStat.name
                            : getSummaryItemNameFromStatPeriodAndType(
                                  summaryItem.statPeriod,
                                  summaryItem.statType,
                                  summaryItem.dateRange,
                              )}
                    </h4>
                    <h4>
                        Completion %:{' '}
                        {(requiredStat?.stat as Percentage).percentage
                            ? (requiredStat?.stat as Percentage).percentage.toFixed(2)
                            : 'N/A'}
                    </h4>
                    <h4>Completed: {(requiredStat?.stat as Percentage).completed}</h4>
                    <h4>Total: {(requiredStat?.stat as Percentage).total}</h4>
                </>
            )}
            {(summaryItem.statType === RequiredStatType.LEAST_COMPLETED ||
                summaryItem.statType === RequiredStatType.MOST_COMPLETED) && (
                <>
                    <h4>{requiredStat?.name}</h4>
                    <h4>Completed: {(requiredStat?.stat as Percentage).completed}</h4>
                    <h4>Total: {(requiredStat?.stat as Percentage).total}</h4>
                </>
            )}
        </Grid>
    );
}
