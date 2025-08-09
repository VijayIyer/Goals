import { CompletionInfo } from '../../types';
import { CompletionQuery } from '../../enums';
import { PerformanceClient } from './client';

export class MockClient implements PerformanceClient {
    getPerformance(query?: CompletionQuery): CompletionInfo {
        return {
            completed: 8,
            total: 10,
            deferred: 0,
        };
    }
}
