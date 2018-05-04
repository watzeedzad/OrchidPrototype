import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Collapse, NavbarToggler, NavbarBrand } from 'reactstrap';
class Header extends Component {
    state = {
        isOpen: false
    };
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-primary">
                <NavbarBrand>Smart Orchid Farm</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/weatherControl" className="nav-link">Weather Control</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/planterAnalyze" className="nav-link">Planter Analyze</Link>
                        </li>
                    </ul>
                </Collapse>
            </nav>
        )
    }
}


export default Header