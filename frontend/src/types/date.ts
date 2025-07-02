import { FilterBy } from '../enums';

export type DateRange = {
    startDate: Date;
    endDate?: Date;
    week: number;
    month: string; // should this be enum
    year: number;
    filterBy: FilterBy;
};
