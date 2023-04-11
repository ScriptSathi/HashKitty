import { Link } from 'react-router-dom';
import { memo, useState } from 'react';
import {
   Navbar as TWNavBar,
   MobileNav,
   Typography,
   IconButton,
} from '@material-tailwind/react';

import logo from '../../assets/images/logo.svg';
import useScreenSize from '../../hooks/useScreenSize';

import './NavBar.scss';

const NavBar = memo(() => {
   const [openNav, setOpenNav] = useState(false);
   useScreenSize({
      callbackOnMobile: () => setOpenNav(false),
   });

   const styleNavItems = 'NavBar__button p-1 font-normal text-lg';

   const navList = (
      <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
         <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className={styleNavItems}
         >
            <Link to="/home" className="links pages">
               Home
            </Link>
         </Typography>
         <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className={styleNavItems}
         >
            <Link to="/templates" className="links pages">
               Templates
            </Link>
         </Typography>
         <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className={styleNavItems}
         >
            <Link to="/lists" className="links pages">
               Lists
            </Link>
         </Typography>
         <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className={styleNavItems}
         >
            <Link to="/server-infos" className="links pages">
               Server infos
            </Link>
         </Typography>
      </ul>
   );

   return (
      <TWNavBar className="mx-auto text-black max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4 border-none">
         <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
            <Link to="/home" className="flex items-center">
               <img className="logoclassName pr-2.5" src={logo} alt="Logo" />
               <Typography as="p" className="font-semibold text-lg">
                  HashKitty
               </Typography>
            </Link>
            <div className="hidden lg:block">{navList}</div>
            <IconButton
               variant="text"
               className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
               ripple={false}
               onClick={() => setOpenNav(!openNav)}
            >
               {openNav ? (
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     className="h-6 w-6"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     strokeWidth={2}
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               ) : (
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-6 w-6"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth={2}
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                     />
                  </svg>
               )}
            </IconButton>
         </div>
         {openNav && (
            <MobileNav
               animate={{
                  mount: {
                     opacity: 1,
                     height: `auto`,
                     transition: { duration: 0.3, times: '[0.4, 0, 0.2, 1]' },
                  },
               }}
               open={openNav}
               className="lg:hidden"
            >
               <div className="container mx-auto">{navList}</div>
            </MobileNav>
         )}
      </TWNavBar>
   );
});

export default NavBar;
