import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';

import './resources/styles/styles.scss';

import MapView from './ui/mapView';
import Leaderboard from './ui/leaderboard';

import AppReducer, { appSaga } from './redux';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  AppReducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
);

sagaMiddleware.run(appSaga);

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="page-wrap">
        <Route exact path="/" component={MapView} />
        <Route path="/leaderboard" component={Leaderboard} />
      </div>
    </Router>
  </Provider>
);

export default App;
