import Frame from '../../components/Frame/Frame';
import HashListsFrame from './HashListFrame/HashListFrame';

export default function Lists() {
   return (
      <Frame>
         <div>
            <div>
               <HashListsFrame />
            </div>
            <div>
               <HashListsFrame />
            </div>
         </div>
      </Frame>
   );
}
