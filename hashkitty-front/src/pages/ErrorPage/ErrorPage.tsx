import { useRouteError, useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar/NavBar';
import { TuseRouteError } from '../../types/THooks';
import logo from '../../assets/images/CryingKitty.svg';
import Button from '../../components/ui/Button/Button';

import './ErrorPage.scss';

export default function ErrorPage() {
   const { statusText } = useRouteError() as TuseRouteError;
   const redirectTo = useNavigate();
   document.body.style.overflow = 'hidden';
   return (
      <div>
         <div>
            <Navbar />
         </div>
         <div className="DivFlex border-solid">
            <div className="ErrorLeftBox">
               <img className="cryingCat" src={logo} alt="Logo" />
            </div>
            <div className="ErrorRightBox">
               <p className="errorText">404 {statusText}</p>
               <h1 className="errorTitle">OH NO!</h1>
               <p className="errorText">The cat is lost</p>
               <div className="w-32">
                  <Button onClick={() => redirectTo('home')}>
                     Back to home
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
