import { Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';

export default function InformationTooltip({ title }: { title: string }) {
    return (
        <Tooltip title={title}>
            <Info />
        </Tooltip>
    );
}
