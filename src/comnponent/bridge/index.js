import React, { Component } from 'react';
import PropTypes from "prop-types";

class Bridge extends Component{
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        let { sessionName, mn, pathname, id } = this.props;
        let store = this.context.store;
        if(mn){
            sessionStorage.setItem(sessionName,JSON.stringify({ sessionName, mn, pathname }));
        }else{
            let param = JSON.parse(sessionStorage.getItem(sessionName))||{};
            mn = param.mn;
            pathname = param.pathname;
        }
        id = id || "app";
        mn && window['require']([`./${mn}/index`],(enter) => {
            enter(pathname, store, id);
        });
    }

    render(){
        return <div id={ this.props.id || "app" }>这是bridge</div>
    }
}

Bridge.contextTypes = {
    store: PropTypes.object,
}

export default Bridge;