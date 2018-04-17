import React, { Component } from 'react';
import { Sidebar } from 'primereact/components/sidebar/Sidebar';

class App extends Component {
    render() {
        return (
            <Sidebar>
                {this.props.children}
            </Sidebar>
        );
    }
}

export default App;