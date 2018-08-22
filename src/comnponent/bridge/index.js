import React, { Component } from 'react';

class Bridge extends Component{
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        let { query } = this.props.location;
        if( query && query.name ){
            query = query.name;
            sessionStorage.setItem("name",query);
        } else {
            query = sessionStorage.getItem("name");
        }
        query && window['require'](["./"+query+"/index"]);
    }

    render(){
        return <div id="app">这是bridge</div>
    }
}

export default Bridge;