import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Typography,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import SelectedDateRangeDisplay from '../common/selectDateRange/selectedDateRangeDisplay';
import { DateRange } from '../../types';
import { getDefaultDateRange } from '../../utils/date';
import { FilterBy, StatPeriod, StatType } from '../../enums';

export default function AddSummaryItemModal({
    isOpen,
    onClose,
    onAddSummaryItemSelection,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAddSummaryItemSelection: (updatedSelection: {
        dateRange: DateRange;
        statType: StatType;
        statPeriod: StatPeriod;
    }) => void;
}) {
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(getDefaultDateRange(FilterBy.DAY));
    const [selectedStatType, setSelectedStatType] = useState<StatType>(StatType.BEST_COMPLETION_PERCENTAGE);
    const [selectedStatPeriod, setSelectedStatPeriod] = useState<StatPeriod>(StatPeriod.DAY);
    const handleConfirm = () => {
        onAddSummaryItemSelection({
            dateRange: selectedDateRange,
            statPeriod: selectedStatPeriod,
            statType: selectedStatType,
        });
        onClose();
    };
    const handleStatTypeSelectionChange = (event: SelectChangeEvent<StatType>) => {
        setSelectedStatType(event.target.value as StatType);
    };
    const handleStatPeriodSelectionChange = (event: SelectChangeEvent<StatPeriod>) => {
        setSelectedStatPeriod(event.target.value as StatPeriod);
    };
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContent>
                <DialogTitle>Choose new info to show in Dashboard</DialogTitle>
                <DialogContentText>
                    <SelectedDateRangeDisplay
                        onDateRangeUpdated={updatedDateRange => setSelectedDateRange(updatedDateRange)}
                        selectedDateRange={selectedDateRange}
                    />
                    <Typography>What Stat do you want to see from this period?</Typography>
                    <Select
                        name="statType"
                        label="Stat Type"
                        value={selectedStatType}
                        onChange={handleStatTypeSelectionChange}
                    >
                        <MenuItem value={'Best'}>Best Completion %</MenuItem>
                        <MenuItem value={'Most'}>Most Completed</MenuItem>
                        <MenuItem value={'Worst'}>Worst Completion %</MenuItem>
                        <MenuItem value={'Least'}>Least Completed</MenuItem>
                    </Select>
                    <Typography>For selected Stat, which results do you want</Typography>
                    <Select
                        name="stat"
                        label="Stat Period"
                        value={selectedStatPeriod}
                        onChange={handleStatPeriodSelectionChange}
                    >
                        <MenuItem value={'Overall'}>Overall</MenuItem>
                        <MenuItem value={'Month'}>Month</MenuItem>
                        <MenuItem value={'Week'}>Week</MenuItem>
                        <MenuItem value={'Day'}>Day</MenuItem>
                    </Select>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}
