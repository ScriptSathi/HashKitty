import { useEffect, useState } from 'react';

type UseScreenSizeProps = {
   callbackOnMobile?: () => void;
   callbackOnLargeScreen?: () => void;
};
export default function useScreenSize({
   callbackOnMobile = () => {},
   callbackOnLargeScreen = () => {},
}: UseScreenSizeProps = {}): { isMobile: boolean; isTablette: boolean } {
   const initScreenWidth = window.innerWidth;
   const [isTablette, setIsTablette] = useState(
      initScreenWidth >= 520 && initScreenWidth <= 960,
   );
   const [isMobile, setIsMobile] = useState(initScreenWidth <= 520);
   useEffect(() => {
      window.addEventListener('resize', () => {
         const screenWidth = window.innerWidth;
         if (screenWidth <= 520) {
            setIsMobile(true);
            setIsTablette(false);
            callbackOnMobile();
         } else if (screenWidth >= 520 && screenWidth <= 960) {
            setIsTablette(true);
            setIsMobile(false);
         } else {
            setIsMobile(false);
            setIsTablette(false);
            callbackOnLargeScreen();
         }
      });
   }, []);
   return { isMobile, isTablette };
}
