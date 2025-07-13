import { StatPeriod, StatType } from '../enums';
import { DateRange } from '../types';

export interface SummaryItem {
    dateRange: DateRange;
    statType: StatType;
    statPeriod: StatPeriod;
}
