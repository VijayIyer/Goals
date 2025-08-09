import { GroupBy, RankStatType, StatType } from '../../enums';
import {
    CompletionInfo,
    FilterCriteria as TaskFilterCriteria,
    NewTask,
    Task,
    DateRange,
    Percentage,
    Completed,
    RankStat,
} from '../../types';

export interface TaskServiceClient {
    createTask: (newTask: NewTask) => Promise<Task>;
    getTasks: (filterCriteria: TaskFilterCriteria) => Promise<Array<Task>>;
    getTaskById: (taskId: number) => Promise<Task>;
    deleteTaskById: (id: number) => Promise<object>;
    editTask: (task: Task) => Promise<Task>;
    getOverallTaskCompletionInfo: () => Promise<CompletionInfo>;
    // TODO: this is temporary till other things are sorted
    getTaskCompletionInfo: (requestedStatType: StatType, dateRange?: DateRange) => Promise<Completed | Percentage>;
    getRankStat: (
        statType: StatType,
        rankStatName: RankStatType,
        rankStatGroupPeriod: GroupBy,
        dateRange?: DateRange,
    ) => Promise<RankStat>;
}
