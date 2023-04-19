type BurgerMenuProps = {
   onClick: () => void;
   isOpen: boolean;
};

function BurgerMenu({ onClick, isOpen }: BurgerMenuProps) {
   return (
      <div className="flex">
         <button
            type="button"
            className="middle none center mr-4 flex items-center justify-center rounded-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
            onClick={onClick}
         >
            {isOpen ? (
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
         </button>
      </div>
   );
}

export default BurgerMenu;
