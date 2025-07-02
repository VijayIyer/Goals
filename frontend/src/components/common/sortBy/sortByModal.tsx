import { ChangeEvent, useState } from 'react';
import { Dialog, DialogContent, FormLabel, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

export default function SortByModal({
    value,
    isOpen,
    onClose,
    onSubmit,
}: {
    value: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (selectedSortValue: string) => void;
}) {
    const [sortBy, setSortBy] = useState<string>(value);
    const handleSortBySelectChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSortBy(event.target.value);
    };
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                component: 'form',
                onSubmit: onSubmit,
            }}
        >
            <DialogContent>
                <FormControl>
                    <FormLabel id="sort-by-label">Sort By</FormLabel>
                    <RadioGroup
                        onChange={handleSortBySelectChange}
                        value={sortBy}
                        row
                        aria-labelledby="sortby"
                        name="sort-by-radio-group"
                    >
                        <FormControlLabel value={'Date'} control={<Radio />} label={'Date'} />
                        <FormControlLabel value={'Priority'} control={<Radio />} label={'Priority'} />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
}
