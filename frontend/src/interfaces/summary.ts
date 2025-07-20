import { GroupBy, RequiredStatType } from '../enums';
import { DateRange } from '../types';
import { DateRangePerformance } from '../types/summary';

export interface RequiredSummaryItemDetails {
    title?: string;
    dateRange: DateRange;
    statType: RequiredStatType;
    statPeriod: GroupBy;
}

export interface PerformanceInDateRange {
    best: DateRangePerformance;
    worst: DateRangePerformance;
}
