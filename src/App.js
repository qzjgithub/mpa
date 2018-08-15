import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Websocket from 'react-websocket';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import './App.styl';

import { testAction } from './redux/action/testAction';

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
        setInterval(()=>{
            this.props.dispatch(testAction(this.state.data + 1));
        },1000);
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
        return <div>
            Count: <strong>{this.state.data}</strong>

            <Websocket url='ws://localhost:8001' ref="mySocket"
                       onOpen={this.onOpen.bind(this)}
                       onMessage={this.handleData.bind(this)}/>

            <DatePicker />
        </div>
    }
}

App.contextTypes = {
    store: PropTypes.object,
    data: PropTypes.number
}

export default connect(state => state.testReducer.data )(App);
