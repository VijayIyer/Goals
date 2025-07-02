import { DateRange } from '../types';
import { getDateWeek } from './week';
import { FilterBy } from '../enums';
export function getRandomDateWithinRange(startDate: Date, endDate: Date): Date {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
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
