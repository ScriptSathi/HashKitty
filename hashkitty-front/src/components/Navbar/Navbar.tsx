import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import './Navbar.scss';

export default class Navbar extends Component {
    public render() {
        return (
            <header className="Navbar mainStyle">
                <Link to="/home" className="links leftBlock">
                    <img className="logoclassName" src={logo} alt="Logo" />
                    <div className="hashKitty">
                        <p className="hashKittyText">HashKitty</p>
                    </div>
                </Link>
                <nav className="rightBlock">
                    <Link to="/home" className="links pages">
                        Home
                    </Link>
                    <Link to="/templates" className="links pages">
                        Templates
                    </Link>
                    <Link to="/lists" className="links pages">
                        Lists
                    </Link>
                    <Link to="/server-infos" className="links pages">
                        Server infos
                    </Link>
                </nav>
            </header>
        );
    }
}
