import React from 'react';
import PropTypes from 'prop-types';
import decode from 'jwt-decode';
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login' }} />
      )
    )}
  />
);
PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/" component={Home} />
    </Switch>
  </BrowserRouter>
);
