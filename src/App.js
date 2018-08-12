import React, { Component } from 'react';
import Websocket from 'react-websocket';
import './App.styl'

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            count: 90
        };
    }

    handleData(data) {
        let result = JSON.parse(data);
        this.setState({count: this.state.count + result.movement});
    }

    onOpen(){
        console.log(this.refs);
        this.refs.mySocket.sendMessage('test');
    }

    render(){
        return <div>
            Count: <strong>{this.state.count}</strong>

            <Websocket url='ws://localhost:8001' ref="mySocket"
                       onOpen={this.onOpen.bind(this)}
                       onMessage={this.handleData.bind(this)}/>
        </div>
    }
}

export default App;
