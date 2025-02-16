import { createContext } from 'react';

export enum ServiceType {
    MOCK,
    EXPRESS,
}

type ServicesContextProviderType = {
    serviceType: ServiceType;
};

const ServicesContext = createContext<ServicesContextProviderType>({
    serviceType: ServiceType.MOCK,
});

export default ServicesContext;
