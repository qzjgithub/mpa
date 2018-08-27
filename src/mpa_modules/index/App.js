import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Websocket from 'react-websocket';
import { DatePicker } from 'antd';
import { Route, IndexRoute } from "react-router";
import { Link } from "react-router-dom";
import './App.styl';

import Header from '../../space_modules/header';

import { testAction } from '../../redux/action/testAction';
import Center from "../../comnponent/center";

class App extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: 90
        };
        this.context.store.subscribe(this.setData.bind(this));
    }

    setData(){
        const state = this.context.store.getState();
        this.setState({
            data: state.testReducer.data
        })
    }

    componentDidMount(){
        /*setInterval(()=>{
            this.props.dispatch(testAction(this.state.data + 1));
        },1000);*/
        this.context.store.dispatch(testAction(this.state.data + 1));
    }

    handleData(data) {
        let result = JSON.parse(data);
        this.setState({data: this.state.count + result.movement});
    }

    onOpen(){
        console.log(this.refs);
        this.refs.mySocket.sendMessage('test');
    }

    render(){
        const { match } = this.props;
        return <div>
            Count: <strong>{this.state.data}</strong>

            {/*<Websocket url='ws://localhost:8001' ref="mySocket"
                       onOpen={this.onOpen.bind(this)}
                       onMessage={this.handleData.bind(this)}/>*/}

            <Link to={{pathname:`${match.url}/demo`,query:{ mn: "demo" }}}>跳转</Link>
            <Route path={`${match.url}/demo`} component={ Center }/>
        </div>
    }
}

App.contextTypes = {
    store: PropTypes.object
}

export default connect(state => state )(App);
