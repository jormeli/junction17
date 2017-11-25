import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentWillMount() {
    fetch('/api/uniques', {headers: {'Accept': 'application/json'}}).then((response) => {
      response.json().then((json) => {
        console.log(json);
        this.setState({
          facedata: json
        })
      });
    })
  }
  render() {
    var title;
    if (this.state.facedata) {
      title = <h1>{ this.state.facedata.uniques } unique visitors today.</h1>;
    } else {
      title = <h1>Loading...</h1>;
    }
    return (
      <div className="App">
        <header>
          <h2>Peopletracker</h2>
        </header>
        <div class="container">
          {title}
        </div>
      </div>
    );
  }
}

export default App;
