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
import { GROUP_BY, Month } from '../../../enums';
import { DateRange } from '../../../types';
import { getWeekStartDate, getWeekEndDate, getDateWeek } from '../../../utils/week';

function formatWeekDateRange(weekNumber: number, year: number): string {
    const weekStartDate = getWeekStartDate(weekNumber, year);
    const weekEndDate = getWeekEndDate(weekNumber, year);
    return `${weekStartDate.getMonth() + 1}/${weekStartDate.getDate()}/${weekStartDate.getFullYear()} to ${weekEndDate.getMonth() + 1}/${weekEndDate.getDate()}/${weekEndDate.getFullYear()}`;
}

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
        if (selectedDateRange.groupBy === GROUP_BY.WEEK && !selectedDateRange.endDate) {
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
    const handleGroupBySelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.value) {
            case GROUP_BY.DAY:
            case GROUP_BY.WEEK:
            case GROUP_BY.MONTH:
            case GROUP_BY.YEAR:
            case GROUP_BY.CUSTOM: {
                setSelectedDateRange({
                    ...selectedDateRange,
                    groupBy: event.target.value,
                });
                onSelectedDateRangeUpdate({
                    ...selectedDateRange,
                    groupBy: event.target.value,
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
                {selectedDateRange.groupBy === GROUP_BY.DAY && (
                    <DatePicker
                        name="deadline"
                        label="Deadline"
                        value={dayjs(selectedDateRange.startDate)}
                        onChange={handleDateRangeDaySelection}
                        views={['day', 'month', 'year']}
                    />
                )}
                {selectedDateRange.groupBy === GROUP_BY.WEEK && (
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
                {selectedDateRange.groupBy === GROUP_BY.MONTH && (
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
                {selectedDateRange.groupBy === GROUP_BY.YEAR && (
                    <DatePicker
                        name="year"
                        label="Year"
                        value={dayjs(selectedDateRange.startDate)}
                        onChange={handleDateRangeWeekOrMonthYearSelection}
                        views={['year']}
                    />
                )}
                {selectedDateRange.groupBy === GROUP_BY.CUSTOM && (
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
                    <FormLabel id="group-by-label">Group By</FormLabel>
                    <RadioGroup
                        onChange={handleGroupBySelectionChange}
                        value={selectedDateRange.groupBy}
                        row
                        aria-labelledby="groupby"
                        name="group-by-radio-group"
                    >
                        <FormControlLabel value={GROUP_BY.DAY} control={<Radio />} label={GROUP_BY.DAY} />
                        <FormControlLabel value={GROUP_BY.WEEK} control={<Radio />} label={GROUP_BY.WEEK} />
                        <FormControlLabel value={GROUP_BY.MONTH} control={<Radio />} label={GROUP_BY.MONTH} />
                        <FormControlLabel value={GROUP_BY.YEAR} control={<Radio />} label={GROUP_BY.YEAR} />
                        <FormControlLabel value={GROUP_BY.CUSTOM} control={<Radio />} label={GROUP_BY.CUSTOM} />
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
