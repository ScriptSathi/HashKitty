import Typography from '@mui/material/Typography';

import { useContext } from 'react';
import type { TTemplate } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';
import ApiEndpoints from '../../../../ApiEndpoints';
import useDeleteTask from '../../../../hooks/useDeleteTask';
import DeleteButton from '../../Buttons/DeleteButton';
import type { ListItem } from '../../../../types/TApi';
import CardContentBuilder from '../../../../utils/CardContentBuilder';
import useScreenSize from '../../../../hooks/useScreenSize';
import ColorModeContext from '../../../../App/ColorModeContext';

type TemplateCardProps = {
   template: ListItem<TTemplate>;
   handleRefresh: () => void;
};

export default function TemplateCard({
   template: { item: template, canBeDeleted },
   handleRefresh,
}: TemplateCardProps) {
   const { deleteTask, isError } = useDeleteTask({
      url: ApiEndpoints.DELETE.template,
      data: template,
   });
   const { isMobile, isTablette } = useScreenSize();
   const {
      theme: { colors },
   } = useContext(ColorModeContext);

   const contentRaws = new CardContentBuilder(template.options);
   const rawsBasedOnScreenSize =
      isMobile || isTablette ? contentRaws.shortRaws : contentRaws.fullRaws;

   const handleDeletion = () => {
      deleteTask().then(() => {
         if (!isError) {
            // wait the the server to process the deletion before refresh
            setTimeout(() => handleRefresh(), 500);
         }
      });
   };

   return (
      <BaseCard
         title={template.name}
         tooltip={
            <>
               {contentRaws.fullRaws.map(row => (
                  <p key={row}>{row}</p>
               ))}
            </>
         }
         autoResize
         additionnalBtn={
            <DeleteButton
               disabled={!canBeDeleted}
               tooltip={`Delete the template ${template.name}`}
               isLoading={false}
               handleDeletion={handleDeletion}
            />
         }
      >
         <div className="max-h-[170px] overflow-auto">
            {rawsBasedOnScreenSize.map(line => (
               <Typography
                  key={line}
                  variant="body2"
                  sx={{ color: colors.font }}
               >
                  {line}
               </Typography>
            ))}
         </div>
      </BaseCard>
   );
}
