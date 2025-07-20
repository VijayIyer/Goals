import { useState, ChangeEvent } from 'react';
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
    TextField,
} from '@mui/material';
import SelectedDateRangeDisplay from '../common/selectDateRange/selectedDateRangeDisplay';
import { DateRange } from '../../types';
import { getDefaultDateRange } from '../../utils/date';
import { FilterBy, GroupBy, RequiredStatType } from '../../enums';
import { SummaryItem } from '../../interfaces';

export default function AddSummaryItemModal({
    isOpen,
    onClose,
    onAddSummaryItemSelection,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAddSummaryItemSelection: (updatedSelection: SummaryItem) => void;
}) {
    const [summaryItemTitle, setSummaryItemTitle] = useState<string>('');
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(getDefaultDateRange(FilterBy.DAY));
    const [selectedStatType, setSelectedStatType] = useState<RequiredStatType>(
        RequiredStatType.BEST_COMPLETION_PERCENTAGE,
    );
    const [selectedStatPeriod, setSelectedStatPeriod] = useState<GroupBy>(GroupBy.DAY);
    const handleConfirm = () => {
        onAddSummaryItemSelection({
            title: summaryItemTitle ?? selectedDateRange.startDate,
            dateRange: selectedDateRange,
            statPeriod: selectedStatPeriod,
            statType: selectedStatType,
        });
        onClose();
    };
    const handleStatTypeSelectionChange = (event: SelectChangeEvent<RequiredStatType>) => {
        setSelectedStatType(event.target.value as RequiredStatType);
    };
    const handleStatPeriodSelectionChange = (event: SelectChangeEvent<GroupBy>) => {
        setSelectedStatPeriod(event.target.value as GroupBy);
    };
    const handleSummaryItemTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSummaryItemTitle(event.target.value);
    };
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogContent>
                <DialogTitle>Choose new info to show in Dashboard</DialogTitle>
                <DialogContentText>
                    {/*TODO: validation - length, allowed letters, etc*/}
                    <TextField
                        label="Summary Stat Label"
                        value={summaryItemTitle}
                        onChange={handleSummaryItemTitleChange}
                    />
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
                        {Object.values(RequiredStatType).map(statType => (
                            <MenuItem key={statType} value={statType}>
                                {statType}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography>For selected Stat, which results do you want</Typography>
                    <Select
                        name="stat"
                        label="Stat Period"
                        value={selectedStatPeriod}
                        onChange={handleStatPeriodSelectionChange}
                    >
                        {Object.values(GroupBy).map(statPeriod => (
                            <MenuItem key={statPeriod} value={statPeriod}>
                                {statPeriod}
                            </MenuItem>
                        ))}
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
