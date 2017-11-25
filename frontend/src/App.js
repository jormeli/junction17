import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';

const App = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
  </div>
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