import React from 'react';

import Routes from 'src/routes/Routes';
import { AppContextProvider } from 'src/contexts/AppContext';
import 'src/i18n';

const App = () => {
  return (
    <AppContextProvider>
      <Routes />
    </AppContextProvider>
  );
};

export default App;
