import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, hashHistory} from 'react-router';
import createHashHistory from 'history/createHashHistory';
import enter from 'mpa-bridge';
import { routerReducer } from 'react-router-redux';

import demoReducer from './redux/reducer';
import configureStore from './redux/store/configureStore';
import App from './App';

const state = window.__initialState__ || undefined;
const store = configureStore(hashHistory, state);
const history = createHashHistory();

let reducers = { ...demoReducer, routing: routerReducer}

let getFixDom = (param) => {
    return <Router history={ history }>
        <section>
            <Route path={`${param.pathname==='/'?'':param.pathname}/`} component={ App }/>
        </section>
    </Router>
}

enter((param, rd) => {
    let dom = getFixDom(param);
    if(rd.store){
        dom = <Provider store={ rd.store }>
            { getFixDom(param) }
        </Provider>;
    }
    render(
        dom,
        document.getElementById(param.id || 'app')
    );
},{ store ,reducers});