import React, { Component } from 'react';
import Bridge from "mpa-bridge-dom";
import PropTypes from "prop-types";
import reducers from '../../redux/reducer';

class Center extends Component{
    constructor(props, context) {
        super(props, context);
        this.id = "app";
        this.sessionName = "center-bridge-route";
        let param = this.props.location;
        if( param.query && param.query.mn ){
            this.pathname = param.pathname;
            this.mn = param.query.mn;
        }
        this.store = this.context.store;
    }

    render(){
        return <Bridge
            store={this.store}
            reducers={reducers}
            sessionName={ this.sessionName }
            mn={this.mn}
            pathname={this.pathname}
            id={this.id} />
    }
}


Center.contextTypes = {
    store: PropTypes.object,
}

export default Center;