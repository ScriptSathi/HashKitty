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
   const {
      toggleColorMode,
      theme: { colors, isDarkTheme },
   } = useContext(ColorModeContext);
   const [openNav, setOpenNav] = useState(false);
   useScreenSize({
      callbackOnMobile: () => setOpenNav(false),
   });
   const pages = ['Home', 'Templates', 'Lists'];

   return (
      <nav
         className="block w-full mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4"
         style={{ backgroundColor: colors.main }}
      >
         <div
            className="container mx-auto flex items-center justify-between"
            style={{ color: colors.font }}
         >
            <NavLink to="/home" className="flex items-center">
               <img
                  className={`pr-2.5 w-[50px] ${isDarkTheme && 'NavBar__logo'}`}
                  src={logo}
                  alt="Logo"
               />
               <p className="block antialiased font-sans text-inherit font-semibold text-lg">
                  HashKitty
               </p>
            </NavLink>
            <div className="hidden lg:flex gap-6">
               <ul className="flex mb-0 mt-0 flex-row items-center gap-6">
                  {pages.map(pageName => (
                     <li
                        key={pageName}
                        className="styleNavItems block antialiased font-sans NavBar__button p-1 font-normal text-lg"
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
                  checked={isDarkTheme}
                  ref={switchRef}
                  onChange={toggleColorMode}
               />
            </div>
            <div className="flex lg:hidden gap-6">
               <MaterialUISwitch
                  checked={isDarkTheme}
                  ref={switchRef}
                  onChange={toggleColorMode}
               />
               <BurgerMenu
                  isOpen={openNav}
                  onClick={() => setOpenNav(!openNav)}
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
                           className="styleNavItems block antialiased font-sans NavBar__button p-1 font-normal text-lg"
                           style={{ color: colors.font }}
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
