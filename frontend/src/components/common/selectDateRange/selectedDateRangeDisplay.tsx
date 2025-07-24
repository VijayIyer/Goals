import { useState } from 'react';

import { IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CalendarIcon } from '@mui/x-date-pickers';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SelectDateRangeModal from './selectDateRangeModal';
import { DateRange } from '../../../types';
import { FilterBy } from '../../../enums';

import { getWeekEndDate, getDateWeek, getWeekStartDate } from '../../../utils/week';

function getPreviousDateRange(dateRange: DateRange): DateRange {
    switch (dateRange.filterBy) {
        case FilterBy.DAY: {
            const newDate = new Date(dateRange.startDate);
            newDate.setDate(newDate.getDate() - 1);
            return {
                ...dateRange,
                startDate: newDate,
                week: getDateWeek(newDate),
                month: newDate.toLocaleString('default', { month: 'long' }),
                year: newDate.getFullYear(),
            };
        }
        case FilterBy.WEEK: {
            const newStartDate = new Date(dateRange.startDate);
            newStartDate.setDate(newStartDate.getDate() - 6);
            const newEndDate = new Date(dateRange.endDate as Date);
            newEndDate.setDate(newEndDate.getDate() - 6);
            return {
                ...dateRange,
                startDate: newStartDate,
                endDate: newEndDate,
                week: getDateWeek(newStartDate),
                month: newStartDate.toLocaleString('default', {
                    month: 'long',
                }),
                year: newStartDate.getFullYear(),
            };
        }
        case FilterBy.MONTH: {
            const newDate = new Date(dateRange.startDate);
            const newMonth = dateRange.startDate.getMonth() - 1;
            newDate.setMonth(newMonth);
            return {
                ...dateRange,
                startDate: newDate,
                month: newDate.toLocaleString('default', { month: 'long' }),
                year: newDate.getFullYear(),
            };
        }
        case FilterBy.YEAR: {
            const newDate = new Date(dateRange.startDate);
            const newYear = dateRange.startDate.getFullYear() - 1;
            newDate.setFullYear(newYear);
            return {
                ...dateRange,
                startDate: newDate,
                year: newYear,
            };
        }
        default:
            return dateRange;
    }
}

function getNextDateRange(dateRange: DateRange): DateRange {
    switch (dateRange.filterBy) {
        case FilterBy.DAY: {
            const newDate = new Date(dateRange.startDate);
            newDate.setDate(newDate.getDate() + 1);
            return {
                ...dateRange,
                startDate: newDate,
                week: getDateWeek(newDate),
                month: newDate.toLocaleString('default', { month: 'long' }),
                year: newDate.getFullYear(),
            };
        }
        case FilterBy.WEEK: {
            const newStartDate = new Date(dateRange.startDate);
            newStartDate.setDate(newStartDate.getDate() + 6);
            const newEndDate = new Date(dateRange.endDate as Date);
            newEndDate.setDate(newEndDate.getDate() + 6);
            return {
                ...dateRange,
                startDate: newStartDate,
                endDate: newEndDate,
                week: getDateWeek(newStartDate),
                month: newStartDate.toLocaleString('default', {
                    month: 'long',
                }),
                year: newStartDate.getFullYear(),
            };
        }
        case FilterBy.MONTH: {
            const newDate = new Date(dateRange.startDate);
            const newMonth = dateRange.startDate.getMonth() + 1;
            newDate.setMonth(newMonth);
            return {
                ...dateRange,
                startDate: newDate,
                month: newDate.toLocaleString('default', { month: 'long' }),
                year: newDate.getFullYear(),
            };
        }
        case FilterBy.YEAR: {
            const newDate = new Date(dateRange.startDate);
            const newYear = dateRange.startDate.getFullYear() + 1;
            newDate.setFullYear(newYear);
            return {
                ...dateRange,
                startDate: newDate,
                year: newYear,
            };
        }
        default:
            return dateRange;
    }
}

function getSelectedDateRangeDisplayText(dateRange: DateRange) {
    switch (dateRange.filterBy) {
        case FilterBy.DAY:
            return dateRange.startDate.toLocaleDateString();
        case FilterBy.WEEK:
        case FilterBy.CUSTOM: {
            return `${getWeekStartDate(dateRange.week, dateRange.year).toLocaleDateString()} - ${dateRange.endDate?.toLocaleDateString() || getWeekEndDate(dateRange.week, dateRange.year).toLocaleDateString()}`;
        }
        case FilterBy.MONTH:
            return dateRange.month + `, ` + dateRange.year;
        case FilterBy.YEAR:
            return dateRange.year;
        default:
            return dateRange.startDate.toLocaleDateString();
    }
}

const useStyles = makeStyles({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
    },
});

interface SelectedDateRangeDisplayProps {
    selectedDateRange: DateRange;
    onDateRangeUpdated: (date: DateRange) => void;
}
export default ({ selectedDateRange, onDateRangeUpdated }: SelectedDateRangeDisplayProps) => {
    const [isSelectDateRangeSelectionModalOpen, setIsSelectDateRangeSelectionModalOpen] = useState(false);

    const handlePreviousClick = () => {
        onDateRangeUpdated(getPreviousDateRange(selectedDateRange));
    };

    const handleNextClick = () => {
        onDateRangeUpdated(getNextDateRange(selectedDateRange));
    };

    const classes = useStyles();

    return (
        <>
            <div className={classes.flexContainer}>
                <IconButton onClick={handlePreviousClick} disabled={selectedDateRange.filterBy === FilterBy.CUSTOM}>
                    <ArrowBackIcon color="primary" />
                </IconButton>
                <div className={classes.flexContainer}>
                    <IconButton onClick={() => setIsSelectDateRangeSelectionModalOpen(true)}>
                        <CalendarIcon color="primary" />
                    </IconButton>
                    <Typography>{getSelectedDateRangeDisplayText(selectedDateRange)}</Typography>
                </div>
                <IconButton onClick={handleNextClick} disabled={selectedDateRange.filterBy === FilterBy.CUSTOM}>
                    <ArrowForwardIcon color="primary" />
                </IconButton>
            </div>
            {isSelectDateRangeSelectionModalOpen && (
                <SelectDateRangeModal
                    currentSelectedDateRange={selectedDateRange}
                    isOpen={isSelectDateRangeSelectionModalOpen}
                    onClose={() => setIsSelectDateRangeSelectionModalOpen(false)}
                    onSelectedDateRangeUpdate={onDateRangeUpdated}
                />
            )}
        </>
    );
};
