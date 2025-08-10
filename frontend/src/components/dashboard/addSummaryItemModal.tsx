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
import { getDefaultDateRange, getSummaryItemNameFromStatPeriodAndType } from '../../utils';
import { FilterBy, GroupBy, RankStatType, StatType } from '../../enums';
import { RequestedSummaryItem } from '../../interfaces';

export default function AddSummaryItemModal({
    isOpen,
    onClose,
    onAddSummaryItemSelection,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAddSummaryItemSelection: (updatedSelection: RequestedSummaryItem) => void;
}) {
    const [summaryItemTitle, setSummaryItemTitle] = useState<string | null>(null);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(getDefaultDateRange(FilterBy.DAY));
    const [selectedStatType, setSelectedStatType] = useState<StatType>(StatType.PERCENTAGE);
    const [selectedRankStatType, setSelectedRankStatType] = useState<RankStatType>(RankStatType.BEST);
    const [selectedRankStatGroupPeriod, setSelectedRankStatGroupPeriod] = useState<GroupBy>(GroupBy.DAY);
    const handleConfirm = () => {
        onAddSummaryItemSelection({
            title:
                summaryItemTitle ??
                getSummaryItemNameFromStatPeriodAndType(
                    selectedStatType,
                    selectedDateRange,
                    selectedRankStatGroupPeriod,
                    selectedRankStatType,
                ),
            dateRange: selectedDateRange,
            statType: selectedStatType,
            rankStatPeriod: selectedRankStatGroupPeriod,
            rankStatType: selectedRankStatType,
        });
        onClose();
    };
    const handleStatTypeSelectionChange = (event: SelectChangeEvent<StatType>) => {
        setSelectedStatType(event.target.value as StatType);
    };
    const handleRankStatTypeSelectionChange = (event: SelectChangeEvent<RankStatType>) => {
        setSelectedRankStatType(event.target.value as RankStatType);
    };
    const handleRankStatGroupPeriodSelectionChange = (event: SelectChangeEvent<GroupBy>) => {
        setSelectedRankStatGroupPeriod(event.target.value as GroupBy);
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
                        label="What to call this Stat Item?"
                        value={summaryItemTitle}
                        onChange={handleSummaryItemTitleChange}
                    />
                    <Typography>What period to calculate stats over?</Typography>
                    <SelectedDateRangeDisplay
                        onDateRangeUpdated={updatedDateRange => setSelectedDateRange(updatedDateRange)}
                        selectedDateRange={selectedDateRange}
                    />
                    {/* TODO: Add styling to associate text field with selection */}
                    <Typography>What Stat do you want to see from this period?</Typography>
                    <Select
                        name="statType"
                        label="Stat Type"
                        value={selectedStatType}
                        onChange={handleStatTypeSelectionChange}
                    >
                        {Object.values(StatType).map(statType => (
                            <MenuItem key={statType} value={statType}>
                                {statType}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* TODO: Add styling to associate text field with selection */}
                    <Typography>Do you want to find rank stats - best or worst, in this period?</Typography>
                    <Select
                        name="statType"
                        label="Rank Stat Type"
                        value={selectedRankStatType}
                        onChange={handleRankStatTypeSelectionChange}
                    >
                        {Object.values(RankStatType).map(statType => (
                            <MenuItem key={statType} value={statType}>
                                {statType}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* TODO: Add styling to associate text field with selection */}
                    <Typography>What should each rank stat period be over? - For e.g best day, best week?</Typography>
                    <Select
                        name="stat"
                        label="Rank Stat Group Period"
                        value={selectedRankStatGroupPeriod}
                        onChange={handleRankStatGroupPeriodSelectionChange}
                    >
                        {Object.values(GroupBy).map(statPeriod => (
                            <MenuItem key={statPeriod} value={statPeriod}>
                                {statPeriod}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography>What should each rank stat period be over? - For e.g best day, best week?</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}
