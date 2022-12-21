import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/images/logo.svg';
import {
    hashKitty,
    hashKittyText,
    leftBlock,
    rightBlock,
    mainStyle,
    logoStyle,
} from '../styles/Navbar';
import '../assets/styles/Navbar.scss';

export default class Navbar extends Component {
    public render() {
        return (
            <header className="Navbar" style={mainStyle}>
                <Link to="/home" className="links" style={leftBlock}>
                    <img style={logoStyle} src={logo} alt="Logo" />
                    <div style={hashKitty}>
                        <p style={hashKittyText}>HashKitty</p>
                    </div>
                </Link>
                <div style={rightBlock}>
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
