import { GroupBy, RequiredStatType } from '../enums';
import { DateRange } from '../types';
import { getDateRangeString } from './date';

export function getSummaryItemNameFromStatPeriodAndType(
    statPeriod: GroupBy,
    statType: RequiredStatType,
    dateRange: DateRange,
): string {
    return `${statPeriod} with ${statType} in ${getDateRangeString(dateRange)}`;
}
