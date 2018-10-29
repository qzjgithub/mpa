import React, { Component } from 'react';
import PropTypes from 'prop-types';

class App extends Component{
    constructor(props, context) {
        super(props, context);
        let store = this.context.store;
        console.log(store.getState());

        store.dispatch({ type: 'TEST_SET', data: 20 });
    }

    render(){
        return <div>demo内的APP</div>
    }
}

App.contextTypes = {
    store: PropTypes.object
}

export default App;
