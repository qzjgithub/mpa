import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, hashHistory} from 'react-router';
import createHashHistory from 'history/createHashHistory';
import createBrowserHistory from 'history/createBrowserHistory';
import enter from 'mpa-bridge';
import { routerReducer } from 'react-router-redux';

import demoReducer from './redux/reducer';
import configureStore from './redux/store/configureStore';
import App from './App';

const state = window.__initialState__ || undefined;
const store = configureStore(browserHistory, state);
const history = createBrowserHistory();

let reducers = { ...demoReducer, routing: routerReducer}

let getFixDom = (param) => {
    console.log(param);
    let pp = (param.pathname==='/'||!param.pathname)?'':param.pathname;
    return <Router history={ history }>
        <section>
            <Route path={`${pp}/`} component={ App }/>
        </section>
    </Router>
}

//enter的最后一个参数，单独开发时为true,整合打包时为false
enter((param, rd) => {
    param = param || { pathname: '/'};
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
},{ store ,reducers}, true);
