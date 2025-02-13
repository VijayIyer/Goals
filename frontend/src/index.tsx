import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import ServicesContext, { ServiceType } from './services/servicesProvider';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const serviceType = process.env.REACT_APP_SERVICE_TYPE === "MOCK" ? ServiceType.MOCK : ServiceType.EXPRESS;

root.render(
	<React.StrictMode>
    	<ServicesContext.Provider 
			value={{
				serviceType
			}}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<App />
			</LocalizationProvider>
		</ServicesContext.Provider>
	</React.StrictMode>
);
