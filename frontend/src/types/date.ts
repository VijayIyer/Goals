import { GROUP_BY } from '../enums';

export type DateRange = {
    startDate: Date;
    endDate?: Date;
    week: number;
    month: string; // should this be enum
    year: number;
    groupBy: GROUP_BY;
};
