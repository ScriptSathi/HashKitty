import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { TuseRouteError } from '../../types/THooks';
import logo from '../../assets/images/CryingKitty.svg';
import './ErrorPage.scss';
import Button from '../Button/Button';

export default function ErrorPage() {
    const { statusText } = useRouteError() as TuseRouteError;
    const redirectTo = useNavigate();
    document.body.style.overflow = 'hidden';
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="DivFlex">
                <div className="ErrorLeftBox">
                    <img className="cryingCat" src={logo} alt="Logo" />
                </div>
                <div className="ErrorRightBox">
                    <p className="errorText">404 {statusText}</p>
                    <h1 className="errorTitle">OH NO!</h1>
                    <p className="errorText">The cat is lost</p>
                    <Button
                        onClick={() => redirectTo('home')}
                        className="button404"
                    >
                        Back to home
                    </Button>
                </div>
            </div>
        </div>
    );
}
