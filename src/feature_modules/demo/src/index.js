import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, hashHistory} from 'react-router';
import createHashHistory from 'history/createHashHistory';
import enter from 'mpa-bridge';

import configureStore from './redux/store/configureStore';
import App from './App';

const state = window.__initialState__ || undefined;
const store = configureStore(hashHistory, state);
const history = createHashHistory();

enter((parentRoute, parentStore, id) => {
    render(
        <Router history={ history }>
            <section>
                <Route path={`${parentRoute}/appDemo`} component={ App }/>
            </section>
        </Router>,
        document.getElementById(id || 'app')
    );
});