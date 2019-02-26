import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, hashHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';

import configureStore from '../../redux/store/configureStore';
import App from './App';

const state = window.__initialState__ || undefined;
const store = configureStore(browserHistory, state);
const history = createBrowserHistory();

render(
    <Provider store={ store }>
        <Router history={ history }>
            <section>
                <Route path="/" component={ App }/>
            </section>
        </Router>
    </Provider>,
    document.getElementById('root')
);