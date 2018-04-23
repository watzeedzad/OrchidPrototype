import React, { Component } from 'react';
import DrawerUi from '../Utils/DrawerUi'

class App extends Component {
    render() {
        return (
            <div>
            <DrawerUi />
                 {this.props.children}
            </div>
        );
    }
}

export default App;