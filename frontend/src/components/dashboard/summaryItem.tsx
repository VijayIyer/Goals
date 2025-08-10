import { useContext, useEffect, useState } from 'react';
import { Completed, DateRange, Percentage, RankStat } from '../../types';

import { Grid2 as Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import ServicesContext from '../../services/servicesProvider';
import { TaskServiceClientFactory } from '../../services/taskServiceClientFactory';
import { GroupBy, RankStatType, StatType } from '../../enums';
import { getDateRangeString } from '../../utils';

const useStyles = makeStyles({
    summaryItem: {
        border: '1px solid',
        padding: '1em',
    },
});

interface SummaryItemProps {
    title: string;
    statType: StatType;
    dateRange?: DateRange;
    rankStatType?: RankStatType;
    rankStatGroupPeriod?: GroupBy;
}
export default function SummaryItem({
    title,
    statType,
    dateRange,
    rankStatType,
    rankStatGroupPeriod,
}: SummaryItemProps) {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [stat, setStat] = useState<Percentage | Completed | RankStat>();

    useEffect(() => {
        async function getCompletionStat() {
            setStat(await service.getTaskCompletionInfo(statType, dateRange));
        }

        async function getRankStat() {
            if (rankStatType && rankStatGroupPeriod)
                setStat(await service.getRankStat(statType, rankStatType, rankStatGroupPeriod, dateRange));
        }
        if (rankStatType && rankStatGroupPeriod) getRankStat();
        else getCompletionStat();
    }, [statType]);
    const classes = useStyles();
    if (stat) {
        if (rankStatType && rankStatGroupPeriod) {
            return (
                <Grid className={classes.summaryItem}>
                    <h3 style={{ wordBreak: 'break-word' }}>{title}</h3>
                    <h5>{(stat as RankStat).name}</h5>
                    {statType === StatType.PERCENTAGE && (
                        <h5>Percentage: {((stat as RankStat).value as Percentage).percentage.toFixed(2)}</h5>
                    )}
                    <h5>Completed: {(stat as RankStat).value.completed}</h5>
                    <h5>Total: {(stat as RankStat).value.total}</h5>
                </Grid>
            );
        }
        return (
            <Grid className={classes.summaryItem}>
                <h3 style={{ wordBreak: 'break-word' }}>{title}</h3>
                {dateRange && <h5>{getDateRangeString(dateRange)}</h5>}
                {statType === StatType.PERCENTAGE && <h5>Percentage: {(stat as Percentage).percentage.toFixed(2)}</h5>}
                <h5>Completed: {(stat as Completed).completed}</h5>
                <h5>Total: {(stat as Completed).total}</h5>
            </Grid>
        );
    }
    return null;
}
