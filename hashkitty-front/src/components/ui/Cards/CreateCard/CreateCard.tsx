import { CardActionArea, Card } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

import useIsMobile from '../../../../hooks/useIsMobile';

export default function CreateCard({
   clickedCreation: [isClickedCreation, setIsClickedCreation],
}: {
   clickedCreation: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
   const isMobile = useIsMobile({});

   const fullSize = {
      width: 400,
      height: 250,
   };
   const smallSize = {
      width: 250,
      height: 150,
   };
   const size = isMobile ? smallSize : fullSize;
   return (
      <Card sx={{ ...size, borderRadius: '1rem', maxWidth: 345, margin: 1 }}>
         <CardActionArea
            sx={{
               display: 'flex',
               flexDirection: 'column',
               fontSize: 18,
               '&:hover': { color: 'secondary.main' },
            }}
            className="h-full w-full"
            onClick={() => !isClickedCreation && setIsClickedCreation(true)}
         >
            <AddBoxIcon
               fontSize="large"
               sx={{ '&:hover': { color: 'secondary.main' } }}
            />
            Create a new task
         </CardActionArea>
      </Card>
   );
}
