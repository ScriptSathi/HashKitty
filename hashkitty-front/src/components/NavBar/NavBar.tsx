import { NavLink } from 'react-router-dom';
import { memo, useContext, useRef, useState } from 'react';

import logo from '../../assets/images/logo.svg';
import useScreenSize from '../../hooks/useScreenSize';

import './NavBar.scss';
import BurgerMenu from './BurgerMenu';
import MaterialUISwitch from '../ui/MUISwitch/MUISwitch';
import ColorModeContext from '../../App/ColorModeContext';

const NavBar = memo(() => {
   const switchRef = useRef(null);
   const colorMode = useContext(ColorModeContext);
   const [openNav, setOpenNav] = useState(false);
   useScreenSize({
      callbackOnMobile: () => setOpenNav(false),
   });
   const pages = ['Home', 'Templates', 'Lists'];

   return (
      <nav className="block w-full rounded-xl backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border border-white/80 bg-white mx-auto text-black max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4 border-none">
         <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
            <NavLink to="/home" className="flex items-center">
               <img className="logoclassName pr-2.5" src={logo} alt="Logo" />
               <p className="block antialiased font-sans text-inherit font-semibold text-lg">
                  HashKitty
               </p>
            </NavLink>
            <div className="hidden lg:flex gap-6">
               <ul className="flex mb-0 mt-0 flex-row items-center gap-6">
                  {pages.map(pageName => (
                     <li
                        key={pageName}
                        className="styleNavItems block antialiased font-sans text-blue-gray-900 NavBar__button p-1 font-normal text-lg"
                     >
                        <NavLink
                           to={`/${pageName.toLowerCase()}`}
                           className="NavLinks pages"
                        >
                           {pageName}
                        </NavLink>
                     </li>
                  ))}
               </ul>
               <MaterialUISwitch
                  checked={colorMode.theme.isDarkTheme}
                  ref={switchRef}
                  onChange={colorMode.toggleColorMode}
               />
            </div>
            <div className="flex lg:hidden">
               <BurgerMenu
                  isOpen={openNav}
                  onClick={() => setOpenNav(!openNav)}
               />
               <MaterialUISwitch
                  checked={colorMode.theme.isDarkTheme}
                  ref={switchRef}
                  onChange={colorMode.toggleColorMode}
               />
            </div>
         </div>
         {openNav && (
            <div
               className="block w-full basis-full overflow-hidden lg:hidden"
               style={{
                  height: 'auto',
                  opacity: 1,
               }}
               data-collapse="navbar"
            >
               <div className="container mx-auto pb-2 transition-all">
                  <ul className="mb-4 mt-2 flex flex-col gap-2 items-center lg:gap-6">
                     {pages.map(pageName => (
                        <li
                           key={pageName}
                           className="styleNavItems block antialiased font-sans text-blue-gray-900 NavBar__button p-1 font-normal text-lg"
                        >
                           <NavLink
                              to={`/${pageName.toLowerCase()}`}
                              className="NavLinks pages"
                           >
                              {pageName}
                           </NavLink>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         )}
      </nav>
   );
});

NavBar.displayName = 'NavBar';
export default NavBar;
