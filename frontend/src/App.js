import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';

import './resources/styles/styles.scss';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  () => {},
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
);

// TODO: run saga

const App = () => (
  <Provider store={{}}>
    <Router>
      <div className="page-wrap">
        <Route exact path="/" component={() => <div>jee</div>} />
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