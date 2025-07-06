import { DateRange } from '../types';
import { getDateWeek, getWeekEndDate, getWeekStartDate } from './week';
import { FilterBy, GroupBy } from '../enums';
export function getRandomDateWithinRange(startDate: Date, endDate: Date): Date {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
}

export function formatDate(date: Date): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
        // 'en-US' for US English locale
        month: 'long', // 'long' for full month name (e.g., "July")
        day: 'numeric', // 'numeric' for day of the month (e.g., "5")
        year: 'numeric', // 'numeric' for four-digit year (e.g., "2025")
    });
    return formatter.format(date);
}

export function formatWeekDateRange(weekNumber: number, year: number): string {
    const weekStartDate = getWeekStartDate(weekNumber, year);
    const weekEndDate = getWeekEndDate(weekNumber, year);
    return `${weekStartDate.toLocaleString('default', { month: 'long' })} ${weekStartDate.getDate()}, ${weekStartDate.getFullYear()} - ${weekEndDate.toLocaleString('default', { month: 'long' })} ${weekEndDate.getDate()}, ${weekEndDate.getFullYear()}`;
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
