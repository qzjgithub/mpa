import React, { Component } from 'react';
import Bridge from "../bridge";

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
    }

    render(){
        return <Bridge sessionName={ this.sessionName } mn={this.mn} pathname={this.pathname} id={this.id}/>
    }
}

export default Center;