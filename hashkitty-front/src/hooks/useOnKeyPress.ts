import { useEffect } from 'react';

export default function useOnKeyPress(
   keyName: KeyboardEvent['key'],
   onKeyPress: () => void,
) {
   useEffect(() => {
      const handleEsc = (event: WindowEventMap['keydown']) => {
         if (event.key === keyName) onKeyPress();
      };
      window.addEventListener('keydown', handleEsc);

      return () => {
         window.removeEventListener('keydown', handleEsc);
      };
   }, []);
}
