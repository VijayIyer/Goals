import { CompletionInfo } from '../../types';
import { CompletionQuery } from '../../enums';
export interface PerformanceClient {
    getPerformance: (query?: CompletionQuery) => CompletionInfo;
}
