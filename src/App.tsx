import React from 'react';
import './App.css';
import GlobalStyles from './components/GlobalStyles';
import routes from './routes';
import theme from './theme';
import { useRoutes } from 'react-router-dom';


import { ThemeProvider } from '@material-ui/core';

const App = () => {

  const routing = useRoutes(routes);

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
}

export default App;
