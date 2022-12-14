import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/images/logo.svg';
import '../assets/styles/Navbar.scss';

class Navbar extends Component {
    styles = {
        height: 60,
        padding: 5,
        fontSize: 24,
        display: 'grid',
        gridTemplateColumns: 'minmax(auto, 55%) auto',
    };
    leftBlock = {
        display: 'grid',
        gap: 0,
        gridTemplateColumns: 'minmax(auto, 7%) 10%',
        gridAutoFlow: 'column',
        logo: {
            width: 50,
        },
        hashKitty: {
            height: 50,
            display: 'inline-block',
            text: {
                paddingTop: 17,
                margin: 0,
            },
        },
    };
    rightBlock = {
        display: 'grid',
        gridAutoFlow: 'column',
        margin: 0,
        paddingTop: 17,
        gap: 20,
    };
    render() {
        return (
            <header className="Navbar" style={this.styles}>
                <Link to="/home" className="links" style={this.leftBlock}>
                    <img style={this.leftBlock.logo} src={logo} alt="Logo" />
                    <div style={this.leftBlock.hashKitty}>
                        <p style={this.leftBlock.hashKitty.text}>HashKitty</p>
                    </div>
                </Link>
                <div style={this.rightBlock}>
                    <Link to="/home" className="links pages">
                        Home
                    </Link>
                    <Link to="/template-tasks" className="links pages">
                        Template tasks
                    </Link>
                    <Link to="/lists" className="links pages">
                        Lists
                    </Link>
                    <Link to="/server-infos" className="links pages">
                        Server infos
                    </Link>
                </div>
            </header>
        );
    }
}

export default Navbar;
