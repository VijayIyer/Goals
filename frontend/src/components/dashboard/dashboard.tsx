import { useContext, useEffect, useState } from 'react';

import { Button, CircularProgress, Grid2 as Grid } from '@mui/material';

import ServicesContext from '../../services/servicesProvider';
import { TaskServiceClientFactory } from '../../services/taskServiceClientFactory';
import { Task } from '../../types';
import { createDateRangeObject, getCurrentYear } from '../../utils/date';
import { FilterBy, GroupBy, RankStatType, StatType } from '../../enums';
import { getDateWeek, getWeekStartDate } from '../../utils/week';

import { RequiredSummaryItemDetails as RequiredSummaryItemData } from '../../interfaces';

import AddSummaryItemModal from './addSummaryItemModal';
import SummaryItem from './summaryItem';
import SummaryItemFromRequestedObject from './summaryItemFromRequestedObject';

function Dashboard() {
    const { serviceType } = useContext(ServicesContext);
    const service = new TaskServiceClientFactory(serviceType).getServiceClient();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [tasks, setTasks] = useState<Array<Task>>([]);
    //const navigate = useNavigate();
    const [summaryItems, setSummaryItems] = useState<Array<RequiredSummaryItemData>>([]);
    const [showAddSummaryItemModal, setShowAddSummaryItemModal] = useState(false);
    // const [showAllTasks, setShowAllTasks] = useState<boolean>(false);

    useEffect(() => {
        async function fetchTasks() {
            setIsRefreshing(true);
            setTasks(await service.getTasks({}));
            setIsRefreshing(false);
        }
        fetchTasks();
    }, []);
    console.log(`isRefreshing - ${isRefreshing}`);
    const handleAddSummaryItemClick = () => {
        setShowAddSummaryItemModal(true);
    };

    const handleAddSummaryItemSelection = (newSummaryItem: RequiredSummaryItemData) => {
        setSummaryItems([...summaryItems, newSummaryItem]);
    };

    if (isRefreshing) return <CircularProgress />;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/* {!showAllTasks && (
                    <>
                        <SelectedDateRangeDisplay
                            selectedDateRange={dateRange}
                            onDateRangeUpdated={(updatedDateRange: DateRange) => setDateRange(updatedDateRange)}
                        />
                    </>
                )} */}
                {/* <Button onClick={() => setShowAllTasks(value => !value)}>
                    {showAllTasks ? 'Show summary for all tasks' : 'Show summary for selected date range'}
                </Button> */}
                <Button onClick={handleAddSummaryItemClick}>Add Summary Item</Button>
                {showAddSummaryItemModal && (
                    <AddSummaryItemModal
                        isOpen={showAddSummaryItemModal}
                        onClose={() => setShowAddSummaryItemModal(false)}
                        onAddSummaryItemSelection={handleAddSummaryItemSelection}
                    />
                )}
            </div>
            <Grid container gap={2} wrap="wrap">
                {summaryItems.map(summaryItem => (
                    <SummaryItem key={summaryItem.title} tasks={tasks} summaryItem={summaryItem} />
                ))}
                <SummaryItemFromRequestedObject title="Overall" statType={StatType.PERCENTAGE} />
                <SummaryItemFromRequestedObject
                    title="This Year"
                    statType={StatType.PERCENTAGE}
                    dateRange={createDateRangeObject(new Date(getCurrentYear(), 0, 1), null, FilterBy.YEAR)}
                />
                <SummaryItemFromRequestedObject
                    title="This Month"
                    statType={StatType.PERCENTAGE}
                    dateRange={createDateRangeObject(
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        FilterBy.MONTH,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="This Week"
                    statType={StatType.PERCENTAGE}
                    dateRange={createDateRangeObject(
                        getWeekStartDate(getDateWeek(new Date()), getCurrentYear()),
                        null,
                        FilterBy.WEEK,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="Best Month this year"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.BEST}
                    rankStatGroupPeriod={GroupBy.MONTH}
                    dateRange={createDateRangeObject(new Date(getCurrentYear(), 0, 1), null, FilterBy.YEAR)}
                />
                <SummaryItemFromRequestedObject
                    title="Worst Month this year"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.WORST}
                    rankStatGroupPeriod={GroupBy.MONTH}
                    dateRange={createDateRangeObject(new Date(getCurrentYear(), 0, 1), null, FilterBy.YEAR)}
                />
                <SummaryItemFromRequestedObject
                    title="Best Week this year"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.BEST}
                    rankStatGroupPeriod={GroupBy.WEEK}
                    dateRange={createDateRangeObject(new Date(getCurrentYear(), 0, 1), null, FilterBy.YEAR)}
                />
                <SummaryItemFromRequestedObject
                    title="Worst Week this year"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.WORST}
                    rankStatGroupPeriod={GroupBy.WEEK}
                    dateRange={createDateRangeObject(new Date(getCurrentYear(), 0, 1), null, FilterBy.YEAR)}
                />
                <SummaryItemFromRequestedObject
                    title="Best Week this month"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.BEST}
                    rankStatGroupPeriod={GroupBy.WEEK}
                    dateRange={createDateRangeObject(
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        null,
                        FilterBy.MONTH,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="Worst Week this month"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.WORST}
                    rankStatGroupPeriod={GroupBy.WEEK}
                    dateRange={createDateRangeObject(
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        null,
                        FilterBy.MONTH,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="Best day this week"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.BEST}
                    rankStatGroupPeriod={GroupBy.DAY}
                    dateRange={createDateRangeObject(
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        null,
                        FilterBy.WEEK,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="Worst day this week"
                    statType={StatType.COMPLETED}
                    rankStatType={RankStatType.WORST}
                    rankStatGroupPeriod={GroupBy.DAY}
                    dateRange={createDateRangeObject(
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        null,
                        FilterBy.WEEK,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="Best day this month"
                    statType={StatType.PERCENTAGE}
                    rankStatType={RankStatType.BEST}
                    rankStatGroupPeriod={GroupBy.DAY}
                    dateRange={createDateRangeObject(
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        null,
                        FilterBy.MONTH,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="Worst day this month"
                    statType={StatType.COMPLETED}
                    rankStatType={RankStatType.WORST}
                    rankStatGroupPeriod={GroupBy.DAY}
                    dateRange={createDateRangeObject(
                        new Date(getCurrentYear(), new Date().getMonth(), 1),
                        null,
                        FilterBy.MONTH,
                    )}
                />
                <SummaryItemFromRequestedObject
                    title="Today"
                    statType={StatType.COMPLETED}
                    dateRange={createDateRangeObject(new Date(), new Date(), FilterBy.DAY)}
                />
                {/* <Grid>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}
                    >
                        {completionInfo.map(taskByDay => {
                            return (
                                <>
                                    <div
                                        style={{
                                            border: '1px solid',
                                            padding: '1em',
                                        }}
                                    >
                                        {taskByDay.date} - {taskByDay.totalCompleted} / {taskByDay.total}
                                        <Button onClick={() => navigate('/', { state: { dateRange } })}>
                                            Go To Date
                                        </Button>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </Grid> */}
            </Grid>
        </>
    );
}
export default Dashboard;
