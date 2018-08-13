import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, useRouterHistory, IndexRoute } from 'react-router';

import { syncHistoryWithStore } from 'react-router-redux';
import useScroll from 'scroll-behavior/lib';
import createBrowserHistory from 'history/createBrowserHistory';

import configureStore from './redux/store/configureStore';
import App from './App';

const state = window.__initialState__ || undefined;
const store = configureStore(browserHistory, state);
const history = createBrowserHistory();
/*console.log(1);
const createScrollHistory = useScroll(new createBrowserHistory());
console.log(2);
const appHistory = useRouterHistory(createScrollHistory)();
console.log(3);
const history = syncHistoryWithStore(appHistory, store);*/

render(
    <Provider store={ store }>
        <Router history={ history }>
            <Route path="/" component={ App }/>
        </Router>
    </Provider>,
    document.getElementById('app')
);