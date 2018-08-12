import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, useRouterHistory, IndexRoute } from 'react-router'
import App from './App';

const state = window.__initialState__ || undefined;
const store = configureStore(browserHistory, state);

const routes = (
    <Route path="/" component={App}></Route>
);

render(
    <Provider store={ store }>
        <Router routes={ routes } />
    </Provider>,
    document.getElementById('app')
);