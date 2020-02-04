import React, {Suspense} from 'react';
import { CssBaseline, LinearProgress } from '@material-ui/core';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${props => props.theme.body.background};
  }
`;

const Root = styled.div`
  max-width: 520px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;

const Page = ({ children }) => {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Suspense fallback={<LinearProgress />}>
        {children}
      </Suspense>
    </Root>
  );
};

export default Page;
