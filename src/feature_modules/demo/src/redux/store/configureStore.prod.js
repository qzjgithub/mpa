import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer'
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
                routerMiddleware(history)
            )
        )
    );
    return store;
}
