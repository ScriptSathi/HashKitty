import React from 'react';
import { useRouteError } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { TuseRouteError } from '../../types/THooks';
import logo from '../../assets/images/CryingKitty.svg';
import './ErrorPage.scss';
import Button from '../Button/Button';

export default function ErrorPage() {
    const { statusText } = useRouteError() as TuseRouteError;
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="DivFlex">
                <div className="LeftBox">
                    <img className="cryingCat" src={logo} alt="Logo" />
                </div>
                <div className="RightBox">
                    <p className="errorText">404</p>
                    <h1 className="errorTitle">OH NO!</h1>
                    <p className="errorText">The cat is lost</p>
                    <Button className="button404">Back to home</Button>
                </div>
            </div>
        </div>
    );
}
