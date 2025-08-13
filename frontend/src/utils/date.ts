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
    return `${weekStartDate.toLocaleString('default', { month: 'short' })} ${weekStartDate.getDate()}, ${weekStartDate.getFullYear()} - ${weekEndDate.toLocaleString('default', { month: 'short' })} ${weekEndDate.getDate()}, ${weekEndDate.getFullYear()}`;
}

export function getGroupKeyForDateRange(deadline: Date, groupBy: GroupBy): string {
    switch (groupBy) {
        case GroupBy.DAY: {
            return deadline.toLocaleDateString();
        }
        case GroupBy.WEEK: {
            return formatWeekDateRange(getDateWeek(deadline), deadline.getFullYear());
        }
        case GroupBy.MONTH: {
            return `${deadline.toLocaleString('default', { month: 'long' })}, ${deadline.getFullYear()}`;
        }
        case GroupBy.YEAR: {
            return deadline.getFullYear().toString();
        }
        default: {
            return deadline.toLocaleDateString();
        }
    }
}

export function getDateRangeString(dateRange: DateRange): string {
    switch (dateRange.filterBy) {
        case FilterBy.DAY: {
            return dateRange.startDate.toLocaleDateString();
        }
        case FilterBy.WEEK: {
            return formatWeekDateRange(getDateWeek(dateRange.startDate), dateRange.year);
        }
        case FilterBy.MONTH: {
            return `${dateRange.startDate.toLocaleString('default', { month: 'long' })}, ${dateRange.year}`;
        }
        case FilterBy.YEAR: {
            return dateRange.year.toString();
        }
        default: {
            return dateRange.startDate.toLocaleDateString();
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

// Helper function to create a date range object when it is not the user inputting this
export function createDateRangeObject(
    startDate: Date,
    endDate: Date | null = null,
    filterBy: FilterBy | null = null,
): DateRange {
    const datePlusSevenDays = new Date(startDate);
    datePlusSevenDays.setDate(datePlusSevenDays.getDate() + 7);
    return {
        startDate: startDate,
        endDate: endDate ? endDate : filterBy === FilterBy.WEEK ? datePlusSevenDays : startDate, //TODO keeping default endDate as startDate (is this correct?)
        week: getDateWeek(startDate),
        month: startDate.toLocaleString('default', { month: 'long' }),
        year: startDate.getFullYear(),
        filterBy: filterBy ?? FilterBy.DAY, // should this be here or part of a separate value
    };
}

export function getCurrentYear(index: number = 0) {
    return new Date().getFullYear() + (index ?? 0);
}

export function getStartDateFromDateRange(dateRange: DateRange | null) {
    if (!dateRange) return new Date(0);
    switch (dateRange.filterBy) {
        case FilterBy.DAY: {
            return new Date(dateRange.startDate);
        }
        case FilterBy.WEEK: {
            return new Date(getWeekStartDate(getDateWeek(dateRange.startDate), dateRange.startDate.getFullYear()));
        }
        case FilterBy.MONTH: {
            return new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), 1);
        }
        case FilterBy.YEAR: {
            return new Date(dateRange.startDate.getFullYear(), 0, 1);
        }
        default: {
            return new Date(0);
        }
    }
}
export function getEndDateFromDateRange(dateRange: DateRange | null) {
    if (!dateRange) return new Date(Number.MAX_SAFE_INTEGER);
    switch (dateRange.filterBy) {
        case FilterBy.DAY: {
            return dateRange.endDate ? new Date(dateRange.endDate) : new Date(dateRange.startDate.getDate() + 1);
        }
        case FilterBy.WEEK: {
            return new Date(dateRange.startDate.getDate() + 6);
        }
        case FilterBy.MONTH: {
            const firstDayOfNextMonth = new Date(
                dateRange.startDate.getFullYear(),
                dateRange.startDate.getMonth() + 1,
                1,
            );
            return new Date(
                dateRange.startDate.getFullYear(),
                dateRange.startDate.getMonth(),
                firstDayOfNextMonth.getDate() - 1,
            );
        }
        case FilterBy.YEAR: {
            const firstDayOfNextYear = new Date(
                dateRange.startDate.getFullYear() + 1,
                dateRange.startDate.getMonth(),
                1,
            );
            const lastDayOfCurrentYear = new Date(firstDayOfNextYear);
            lastDayOfCurrentYear.setDate(firstDayOfNextYear.getDate() - 1);
            return lastDayOfCurrentYear;
        }
        default: {
            return new Date(0);
        }
    }
}
