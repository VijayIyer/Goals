import { useState } from 'react';
import { IconButton } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import SortByModal from './sortByModal';

export default function SortByButton({
    sortBy,
    onSortBySelection,
}: {
    sortBy: string;
    onSortBySelection: (selectedSortValue: string) => void;
}) {
    const [showSortByModal, setShowSortByModal] = useState<boolean>(false);
    const handleSortByButtonClick = () => {
        setShowSortByModal((value: boolean) => !value);
    };
    const handleSortBySelection = (selectedSortValue: string) => {
        onSortBySelection(selectedSortValue);
    };
    return (
        <>
            <IconButton size="large" color="primary" onClick={handleSortByButtonClick}>
                <SortIcon />
            </IconButton>
            {showSortByModal && (
                <SortByModal
                    value={sortBy}
                    isOpen={showSortByModal}
                    onClose={() => setShowSortByModal(false)}
                    onSubmit={handleSortBySelection}
                />
            )}
        </>
    );
}
