import { ServiceType } from "./servicesProvider";
import ExpressClientInstance from "./taskServiceClients/expressClient";
import MockClientInstance from "./taskServiceClients/mockClient";

export class TaskServiceClientFactory {
	serviceType: ServiceType;
	mockClientInstance: any;
	expressClientInstance: any;
	constructor(serviceType: ServiceType) {
		this.serviceType = serviceType;
		this.expressClientInstance = ExpressClientInstance;
		this.mockClientInstance = MockClientInstance;
	}
	getServiceClient() {
		if(this.serviceType === ServiceType.MOCK) {
			return this.mockClientInstance;
		}
		if(this.serviceType === ServiceType.EXPRESS) {
			return this.expressClientInstance;
		}
		else {
			throw Error(`No known backend service of type ${this.serviceType}`)
		}
	}
}