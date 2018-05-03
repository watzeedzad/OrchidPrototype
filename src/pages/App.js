import React, { Component } from 'react';
import Sidebar from '../components/Sidebar/Drawers'

class App extends Component {
    render() {
        return (
            <div>
            <Sidebar/>
                 {this.props.children}

            </div>
        );
    }
}

export default App;