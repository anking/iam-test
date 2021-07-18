import './App.css';
import GlobalStyles from './components/GlobalStyles';
import routes from './routes';
import theme from './theme';
import { useRoutes } from 'react-router-dom';


import { ThemeProvider } from '@material-ui/core';

const App = () => {

  const routing = useRoutes(routes);

  return <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
}

export default App;
