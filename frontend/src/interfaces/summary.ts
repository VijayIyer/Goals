import { GroupBy, RequiredStatType } from '../enums';
import { DateRange } from '../types';

export interface RequiredSummaryItemDetails {
    title?: string;
    dateRange: DateRange;
    statType: RequiredStatType;
    statPeriod: GroupBy;
}
