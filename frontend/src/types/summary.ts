export type Percentage = Completed & {
    percentage: number;
};

export type Completed = {
    completed: number;
    total: number;
};

export type RankStat = {
    name: string;
    value: Percentage | Completed;
};
