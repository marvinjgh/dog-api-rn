import React from 'react';
import {StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import Theme from './src/constants/Theme';
import Navigation from './src/navigations';
import store from './src/redux/store';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={Theme}>
        <StatusBar barStyle={'light-content'} />
        <Navigation theme={Theme} />
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
