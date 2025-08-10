import { GroupBy, RankStatType, StatType } from '../enums';
import { GroupedTasksSummary } from '../interfaces';
import { DateRange } from '../types';
import { getDateRangeString } from './date';

export function getSummaryItemNameFromStatPeriodAndType(
    statType: StatType,
    dateRange: DateRange,
    rankStatPeriod: GroupBy,
    rankStatType: RankStatType,
): string {
    return `${rankStatPeriod} with ${rankStatType} ${statType} in ${getDateRangeString(dateRange)}`;
}

export function getBestPerformingItem(
    groupedTasksSummary: Array<GroupedTasksSummary>,
    statType: StatType,
): GroupedTasksSummary {
    if (statType === StatType.COMPLETED) {
        return groupedTasksSummary.reduce(
            (prev, current) => {
                return !prev.name ? current : prev.completed > current.completed ? prev : current;
            },
            { name: '', completed: 0, total: 1 },
        );
    } else {
        return groupedTasksSummary.reduce(
            (prev, current) => {
                return !prev.name
                    ? current
                    : prev.completed / prev.total > current.completed / current.total
                      ? prev
                      : current;
            },
            { name: '', completed: 0, total: 1 },
        );
    }
}

export function getWorstPerformingItem(
    groupedTasksSummary: Array<GroupedTasksSummary>,
    statType: StatType,
): GroupedTasksSummary {
    if (statType === StatType.COMPLETED) {
        return groupedTasksSummary.reduce(
            (prev, current) => {
                return !prev.name ? current : prev.completed < current.completed ? prev : current;
            },
            { name: '', completed: 0, total: 1 },
        );
    } else {
        return groupedTasksSummary.reduce(
            (prev, current) => {
                return !prev.name
                    ? current
                    : prev.completed / prev.total < current.completed / current.total
                      ? prev
                      : current;
            },
            { name: '', completed: 0, total: 1 },
        );
    }
}
