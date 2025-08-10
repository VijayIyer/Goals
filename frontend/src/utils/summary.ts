import { GroupBy, RankStatType, StatType } from '../enums';
import { DateRange } from '../types';
import { getDateRangeString } from './date';

export function getSummaryItemNameFromStatPeriodAndType(
    statType: StatType,
    dateRange: DateRange,
    rankStatPeriod: GroupBy,
    rankStatType: RankStatType,
): string {
    return `${rankStatPeriod} with ${rankStatType} ${statType} in ${getDateRangeString(dateRange)}`;
}
