import { createContext } from 'react';

export enum ServiceType {
    MOCK,
    HTTP,
}

type ServicesContextProviderType = {
    serviceType: ServiceType;
};

const ServicesContext = createContext<ServicesContextProviderType>({
    serviceType: ServiceType.MOCK,
});

export default ServicesContext;
