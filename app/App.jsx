import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { Provider } from 'react-redux';

import QuestionPage from './Features/QuestionPage';
import AnswerPage from './Features/AnswerPage';

import configStore from './store/configStore';
import './App.scss';

const store = configStore({});

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <div className="MainLayout">
            <Switch>
              <Route path="/" exact component={QuestionPage} />
              <Route path="/:id" component={AnswerPage} />
            </Switch>
          </div>
        </Provider>
      </Router>
    );
  }
}

export default App;
