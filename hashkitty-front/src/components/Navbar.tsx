import React, { Component } from 'react';
import logo from '../assets/images/Logo.png';
import '../assets/fonts/Inter-Bold.ttf';
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
            <header className="NavbarLogo" style={this.styles}>
                <div style={this.leftBlock}>
                    <img style={this.leftBlock.logo} src={logo} alt="Logo" />
                    <div style={this.leftBlock.hashKitty}>
                        <p style={this.leftBlock.hashKitty.text}>HashKitty</p>
                    </div>
                </div>
                <div style={this.rightBlock}>
                    <a className="NavbarLinks">Home</a>
                    <a className="NavbarLinks">Tasks</a>
                    <a className="NavbarLinks">Lists</a>
                    <a className="NavbarLinks">Server infos</a>
                </div>
            </header>
        );
    }
}

export default Navbar;
