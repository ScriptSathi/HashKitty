import { useEffect, useState } from 'react';

type UseIsMobileProps = {
   callbackOnMobile?: () => void;
   callbackOnLargeScreen?: () => void;
};
export default function useIsMobile({
   callbackOnMobile = () => {},
   callbackOnLargeScreen = () => {},
}: UseIsMobileProps = {}): boolean {
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
   useEffect(() => {
      window.addEventListener('resize', () => {
         if (window.innerWidth >= 960) {
            setIsMobile(false);
            callbackOnLargeScreen();
         } else {
            setIsMobile(true);
            callbackOnMobile();
         }
      });
   }, []);
   return isMobile;
}
