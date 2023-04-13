import Typography from '@mui/material/Typography';

import type { TTemplate } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';
import ApiEndpoints from '../../../../ApiEndpoints';
import useDeleteTask from '../../../../hooks/useDeleteTask';
import DeleteButton from '../../Buttons/DeleteButton';
import type { ListItem } from '../../../../types/TApi';

function buildTemplateRaws(template: TTemplate): string[] {
   const isStraightAttack = template.options.attackModeId.mode === 0;
   const isCombinatorAttack = template.options.attackModeId.mode === 1;
   const isBFAttack = template.options.attackModeId.mode === 3;
   const isAssociationAttack = template.options.attackModeId.mode === 9;

   const maskQueryIsDefineOnValidAttackMode =
      !isStraightAttack &&
      !isAssociationAttack &&
      !isCombinatorAttack &&
      !!template.options.maskQuery;

   const rules = template.options.rules?.split(',');
   const raws = [
      `Attack mode: ${template.options.attackModeId.mode} - ${template.options.attackModeId.name}`,
   ];
   if (!isBFAttack) raws.push(`Wordlist: ${template.options.wordlistId.name}`);
   if (rules)
      raws.push(`${rules.length > 1 ? 'Rules' : 'Rule'} : ${rules.join(', ')}`);
   if (template.options.potfileName)
      raws.push(`Potfile : ${template.options.potfileName}`);
   if (isCombinatorAttack)
      raws.push(
         `Combinator wordlist : ${template.options.combinatorWordlistId?.name}`,
      );
   if (maskQueryIsDefineOnValidAttackMode)
      raws.push(`Mask query : ${template.options.maskQuery}`);
   if (isBFAttack) {
      if (template.options.customCharset1)
         raws.push(`Custom charset 1 : ${template.options.customCharset1}`);
      if (template.options.customCharset2)
         raws.push(`Custom charset 2 : ${template.options.customCharset2}`);
      if (template.options.customCharset3)
         raws.push(`Custom charset 3 : ${template.options.customCharset3}`);
      if (template.options.customCharset4)
         raws.push(`Custom charset 4 : ${template.options.customCharset4}`);
   }
   if (template.options.CPUOnly) raws.push('CPU Only');
   if (template.options.kernelOpti) raws.push('Enable kernel optimization');
   return raws;
}

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

   const raws = buildTemplateRaws(template);

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
               {raws.map(row => (
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
         {raws.map(line => (
            <Typography key={line} variant="body2" color="text.secondary">
               {line}
            </Typography>
         ))}
      </BaseCard>
   );
}
