import React, { Component } from 'react';
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";


class App extends Component {

  render() {
    return (
      <Router>
      <div>
        <PrivateRoute exact path="/" component={HomePage} />
        <LoginRoute path="/login" component={LoginPage} />
      </div>
      </Router>
    );
  }

}

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

export const LoginRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        !localStorage.getItem('user')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )} />
)

export default App;
