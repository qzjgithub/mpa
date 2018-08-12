import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from '../reducer';
import { routerReducer, routerMiddleware } from 'react-router-redux'

export default function configureStore(history, initialState) {
    const reducer = combineReducers({
        ...reducers,
        routing: routerReducer
      })

    const store = createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(
                thunk, 
                createLogger(), 
                routerMiddleware(history)
            )
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducer', () => {
            const nextRootReducer = require('../reducer').default
            store.replaceReducer(nextRootReducer)
        });
    }

    return store;
}
