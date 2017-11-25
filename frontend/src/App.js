import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';

import './resources/styles/styles.scss';

import MapView from './ui/mapView';

import AppReducer, { appSaga } from './redux';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  AppReducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
);

// TODO: run saga
sagaMiddleware.run(appSaga);

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="page-wrap">
        <Route exact path="/" component={MapView} />
      </div>
    </Router>
  </Provider>
);

export default App;


// fetch('/api/index', {headers: {'Accept': 'application/json'}})
    // .then((response) => {
    //   if (response.ok) {
    //     return response.json();
    //   } else {
    //     throw Error();
    //   }
    //   .then(data => this.setState({ facedata: data }))
      // response.json().then((json) => {
      //   console.log(json);
      //   this.setState({
      //     facedata: json
      //   })
      // });
    // })