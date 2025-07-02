import { useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import { CalendarIcon } from '@mui/x-date-pickers';
import SelectDateRangeModal from './selectDateRangeModal';
import { DateRange } from '../../../types';
import { FilterBy } from '../../../enums';
import { getWeekEndDate, getDateWeek } from '../../../utils/week';

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

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={handlePreviousClick} disabled={selectedDateRange.filterBy === FilterBy.CUSTOM}>
                    Previous
                </Button>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={() => {
                            setIsSelectDateRangeSelectionModalOpen(true);
                        }}
                    >
                        <CalendarIcon />
                    </IconButton>
                    <Typography>
                        {selectedDateRange.filterBy === FilterBy.DAY &&
                            selectedDateRange.startDate.toLocaleDateString()}
                        {selectedDateRange.filterBy === FilterBy.WEEK && (
                            <>
                                {selectedDateRange.startDate.toLocaleDateString()} -{' '}
                                {selectedDateRange.endDate?.toLocaleDateString() ||
                                    getWeekEndDate(selectedDateRange.week, selectedDateRange.year).toLocaleDateString()}
                            </>
                        )}
                        {selectedDateRange.filterBy === FilterBy.MONTH &&
                            selectedDateRange.month + `, ` + selectedDateRange.year}
                        {selectedDateRange.filterBy === FilterBy.YEAR && selectedDateRange.year}
                        {selectedDateRange.filterBy === FilterBy.CUSTOM && selectedDateRange.endDate && (
                            <>
                                {selectedDateRange.startDate.toLocaleDateString()} -{' '}
                                {selectedDateRange.endDate.toLocaleDateString()}
                            </>
                        )}
                    </Typography>
                </div>
                <Button onClick={handleNextClick} disabled={selectedDateRange.filterBy === FilterBy.CUSTOM}>
                    Next
                </Button>
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
