import React, { Component } from 'react';
import 'requirejs/require';

class Bridge extends Component{
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        console.log(this.props);
        let { query } = this.props.location;
        console.log(typeof require);
        if( query && query.name ){
            query = query.name;
            sessionStorage.setItem("name",query);
        } else {
            query = sessionStorage.getItem("name");
        }
        require.config({
            path: {
                [query]: "../"+query+"/index/main"
            }
        });
        query && require(["./"+query+"/index/main"]);
    }

    render(){
        return <section id="app">这是bridge</section>
    }
}

export default Bridge;