import { DateRange } from '../types';
import { getDateWeek } from './week';
import { FilterBy, GroupBy } from '../enums';
export function getRandomDateWithinRange(startDate: Date, endDate: Date): Date {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
}

export function getRangeForDate(deadline: Date, groupBy: GroupBy): string {
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

export function getDefaultDateRange(filterBy: FilterBy | null): DateRange {
    const today = new Date();
    const todayPlusSevenDays = new Date();
    todayPlusSevenDays.setDate(todayPlusSevenDays.getDate() + 7);
    return {
        startDate: today,
        endDate: filterBy === FilterBy.WEEK ? todayPlusSevenDays : undefined,
        week: getDateWeek(today),
        month: today.toLocaleString('default', { month: 'long' }),
        year: today.getFullYear(),
        filterBy: filterBy ?? FilterBy.DAY, // should this be here or part of a separate value
    };
}
