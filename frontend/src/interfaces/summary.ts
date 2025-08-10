import { GroupBy, RankStatType, StatType } from '../enums';
import { DateRange } from '../types';

export interface RequestedSummaryItem {
    title: string;
    dateRange: DateRange;
    statType: StatType;
    rankStatType?: RankStatType;
    rankStatPeriod?: GroupBy;
}
