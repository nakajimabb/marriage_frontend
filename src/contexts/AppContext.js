import React, { createContext, useReducer } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';

import maTheme from 'src/theme';
import reducer, { initialState } from 'src/redux/reducers';

const AppContext = createContext();

export const AppContextProvider = props => {
  let [state, dispatch] = useReducer(reducer, initialState);
  const currentTheme = state.theme.currentTheme;

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={maTheme[currentTheme]}>
            <ThemeProvider theme={maTheme[currentTheme]}>
              {props.children}
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </AppContext.Provider>
  );
};

export default AppContext;
