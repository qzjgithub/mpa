import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, useRouterHistory, IndexRoute } from 'react-router';

import createBrowserHistory from 'history/createBrowserHistory';

import configureStore from './redux/store/configureStore';
import App from './App';

const state = window.__initialState__ || undefined;
const store = configureStore(browserHistory, state);
const history = createBrowserHistory();

render(
    <Provider store={ store }>
        <Router history={ history }>
            <Route path="/" component={ App }/>
        </Router>
    </Provider>,
    document.getElementById('root')
);