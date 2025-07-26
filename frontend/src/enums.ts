export enum TaskPriority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
}

export enum CompletionQuery {
    OVERALL = 'overall',
    AVERAGE = 'average',
    MAX = 'max',
    MIN = 'min',
}

export enum FilterBy {
    DAY = 'Day',
    WEEK = 'Week',
    MONTH = 'Month',
    YEAR = 'Year',
    CUSTOM = 'Custom',
    NONE = 'None',
}

export enum GroupBy {
    DAY = 'Day',
    WEEK = 'Week',
    MONTH = 'Month',
    YEAR = 'Year',
}

export enum Month {
    JANUARY = 'January',
    FEBRUARY = 'February',
    MARCH = 'March',
    APRIL = 'April',
    MAY = 'May',
    JUNE = 'June',
    JULY = 'July',
    AUGUST = 'August',
    SEPTEMBER = 'September',
    OCTOBER = 'October',
    NOVEMBER = 'November',
    DECEMBER = 'December',
}

export enum RequiredStatType {
    BEST_COMPLETION_PERCENTAGE = 'Best Completion Percentage',
    WORST_COMPLETION_PERCENTAGE = 'Worst Completion Percentage',
    MOST_COMPLETED = 'Most completed',
    LEAST_COMPLETED = 'Least completed',
}
