import { useState } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { FilterBy, Month } from '../../../enums';
import { DateRange } from '../../../types';
import { getWeekStartDate, getWeekEndDate, getDateWeek } from '../../../utils/week';
import { formatWeekDateRange } from '../../../utils/date';

interface SelectDateRangeModalProps {
    currentSelectedDateRange: DateRange;
    isOpen: boolean;
    onClose: () => void;
    onSelectedDateRangeUpdate: (selectedDate: DateRange) => void;
}

function SelectDateRangeModal({
    currentSelectedDateRange,
    isOpen = false,
    onClose,
    onSelectedDateRangeUpdate,
}: SelectDateRangeModalProps) {
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(currentSelectedDateRange);
    const handleConfirm = () => {
        if (selectedDateRange.filterBy === FilterBy.WEEK && !selectedDateRange.endDate) {
            const endDate = new Date(selectedDateRange.startDate);
            endDate.setDate(selectedDateRange.startDate.getDate() + 6);
            onSelectedDateRangeUpdate({
                ...selectedDateRange,
                endDate,
            });
        } else {
            onSelectedDateRangeUpdate(selectedDateRange);
        }
        onClose();
    };

    const handleDateRangeDaySelection = (date: Dayjs | null) => {
        const newDate = date?.toDate() || currentSelectedDateRange.startDate;
        setSelectedDateRange({
            ...selectedDateRange,
            week: getDateWeek(newDate),
            startDate: newDate,
            month: Object.keys(Month).find((month, index) => index === newDate.getMonth()) || selectedDateRange.month,
            year: newDate.getFullYear(),
        });
    };
    const handleDateRangeWeekNumberSelection = (event: SelectChangeEvent<number>) => {
        const newStartDate = getWeekStartDate(
            event.target.value as number,
            selectedDateRange.year || new Date().getFullYear(),
        );
        setSelectedDateRange({
            ...selectedDateRange,
            startDate: newStartDate,
            endDate: getWeekEndDate(event.target.value as number, selectedDateRange.year || new Date().getFullYear()),
            month:
                Object.keys(Month).find((month, index) => index === newStartDate.getMonth()) || selectedDateRange.month,
            week: Number(event.target.value),
        });
    };
    const handleDateRangeWeekOrMonthYearSelection = (year: Dayjs | null) => {
        const newYearSelection = year?.year() || selectedDateRange.year || new Date().getFullYear();
        const newDate = selectedDateRange.startDate;
        newDate.setFullYear(newYearSelection);
        setSelectedDateRange({
            ...selectedDateRange,
            startDate: newDate,
            year: newYearSelection,
        });
    };
    const handleDateRangeMonthSelection = (event: SelectChangeEvent<string>) => {
        setSelectedDateRange({
            ...selectedDateRange,
            month: event.target.value,
        });
    };
    const handleDateRangeStartDateSelectionChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDateRange({
                ...selectedDateRange,
                startDate: date.toDate(),
            });
        }
    };
    const handleDateRangeEndDateSelectionChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDateRange({
                ...selectedDateRange,
                endDate: date.toDate(),
            });
        }
    };
    const handleFilterBySelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.value) {
            case FilterBy.DAY:
            case FilterBy.WEEK:
            case FilterBy.MONTH:
            case FilterBy.YEAR:
            case FilterBy.CUSTOM: {
                setSelectedDateRange({
                    ...selectedDateRange,
                    filterBy: event.target.value,
                });
                onSelectedDateRangeUpdate({
                    ...selectedDateRange,
                    filterBy: event.target.value,
                });
                return;
            }
            default:
                return;
        }
    };
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Select Date Range</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please select a specific date or a date range (start and end date)
                </DialogContentText>
                {selectedDateRange.filterBy === FilterBy.DAY && (
                    <DatePicker
                        name="deadline"
                        label="Deadline"
                        value={dayjs(selectedDateRange.startDate)}
                        onChange={handleDateRangeDaySelection}
                        views={['day', 'month', 'year']}
                    />
                )}
                {selectedDateRange.filterBy === FilterBy.WEEK && (
                    <FormControl>
                        <Select
                            onChange={handleDateRangeWeekNumberSelection}
                            value={selectedDateRange.week || getDateWeek(selectedDateRange.startDate)}
                            label="Week"
                        >
                            {Array.from({ length: 52 }, (_, i) => i + 1).map(weekNumber => (
                                <MenuItem key={weekNumber} value={weekNumber}>
                                    {formatWeekDateRange(
                                        weekNumber,
                                        selectedDateRange.year || new Date().getFullYear(),
                                    )}
                                </MenuItem>
                            ))}
                        </Select>
                        <DatePicker
                            name="year"
                            label="Year"
                            value={dayjs(selectedDateRange.startDate)}
                            onChange={handleDateRangeWeekOrMonthYearSelection}
                            views={['year']}
                        />
                    </FormControl>
                )}{' '}
                {selectedDateRange.filterBy === FilterBy.MONTH && (
                    <FormControl>
                        <Select label="Month" value={selectedDateRange.month} onChange={handleDateRangeMonthSelection}>
                            {Object.values(Month).map(month => (
                                <MenuItem key={month} value={month}>
                                    {month}
                                </MenuItem>
                            ))}
                        </Select>
                        <DatePicker
                            name="year"
                            label="Year"
                            value={dayjs(selectedDateRange.startDate)}
                            onChange={handleDateRangeWeekOrMonthYearSelection}
                            views={['year']}
                        />
                    </FormControl>
                )}
                {selectedDateRange.filterBy === FilterBy.YEAR && (
                    <DatePicker
                        name="year"
                        label="Year"
                        value={dayjs(selectedDateRange.startDate)}
                        onChange={handleDateRangeWeekOrMonthYearSelection}
                        views={['year']}
                    />
                )}
                {selectedDateRange.filterBy === FilterBy.CUSTOM && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DatePicker
                            name="startDate"
                            label="Start Date"
                            value={dayjs(selectedDateRange.startDate)}
                            onChange={handleDateRangeStartDateSelectionChange}
                        />
                        &nbsp;&nbsp;-&nbsp;&nbsp;
                        <DatePicker
                            name="endDate"
                            label="End Date"
                            value={dayjs(selectedDateRange.endDate)}
                            onChange={handleDateRangeEndDateSelectionChange}
                        />
                    </div>
                )}
                <FormControl>
                    <FormLabel id="filter-by-label">Filter By</FormLabel>
                    <RadioGroup
                        onChange={handleFilterBySelectionChange}
                        value={selectedDateRange.filterBy}
                        row
                        aria-labelledby="filterBy"
                        name="filter-by-radio-group"
                    >
                        <FormControlLabel value={FilterBy.DAY} control={<Radio />} label={FilterBy.DAY} />
                        <FormControlLabel value={FilterBy.WEEK} control={<Radio />} label={FilterBy.WEEK} />
                        <FormControlLabel value={FilterBy.MONTH} control={<Radio />} label={FilterBy.MONTH} />
                        <FormControlLabel value={FilterBy.YEAR} control={<Radio />} label={FilterBy.YEAR} />
                        <FormControlLabel value={FilterBy.CUSTOM} control={<Radio />} label={FilterBy.CUSTOM} />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleConfirm}>Confirm Selection</Button>
            </DialogActions>
        </Dialog>
    );
}
export default SelectDateRangeModal;
