import { ServiceType } from './servicesProvider';
import { TaskServiceClient } from './taskServiceClients/client';
import HttpClientInstance from './taskServiceClients/httpClient';
import MockClientInstance from './taskServiceClients/mockClient';

export class TaskServiceClientFactory {
    serviceType: ServiceType;
    mockClientInstance: TaskServiceClient;
    httpClientInstance: TaskServiceClient;
    constructor(serviceType: ServiceType) {
        this.serviceType = serviceType;
        this.httpClientInstance = HttpClientInstance;
        this.mockClientInstance = MockClientInstance;
    }
    getServiceClient() {
        if (this.serviceType === ServiceType.MOCK) {
            return this.mockClientInstance;
        }
        if (this.serviceType === ServiceType.HTTP) {
            return this.httpClientInstance;
        } else {
            throw Error(`No known backend service of type ${this.serviceType}`);
        }
    }
}
