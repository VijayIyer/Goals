// TODO: answer taken from here - https://www.geeksforgeeks.org/calculate-current-week-number-in-javascript/, create your own
export function getDateWeek(date: Date): number {
    const januaryFirst = new Date(date.getFullYear(), 0, 1);
    const daysToNextMonday =
        januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(
        date.getFullYear(),
        0,
        januaryFirst.getDate() + daysToNextMonday,
    );

    return date < nextMonday
        ? 52
        : date > nextMonday
          ? Math.ceil(
                (date.getTime() - nextMonday.getTime()) /
                    (24 * 3600 * 1000) /
                    7,
            )
          : 1;
}

export function getWeekStartDate(weekNumber: number, year: number): Date {
    const date = new Date(year, 0);
    return new Date(date.setDate(weekNumber * 7));
}
export function getWeekEndDate(weekNumber: number, year: number): Date {
    const date = new Date(year, 0);
    return new Date(date.setDate(weekNumber * 7 + 6));
}
