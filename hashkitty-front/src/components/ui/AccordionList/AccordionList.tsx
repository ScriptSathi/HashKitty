import {
   Accordion,
   AccordionDetails,
   AccordionSummary,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableRow,
   Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import Button from '../Buttons/Button';
import BackgroundBlur from '../BackgroundBlur/BackGroundBlur';
import ImportList from '../../ImportList/ImportList';
import {
   ListItem,
   ListItemAvailable,
   UploadFileType,
} from '../../../types/TApi';
import useSendForm from '../../../hooks/useSendForm';
import ApiEndpoints from '../../../ApiEndpoints';
import Raw from './Raw';

type AccordionListProps<List extends ListItemAvailable> = {
   list: ListItem<List>[];
   name: string;
   refreshLists: () => void;
   expanded?: boolean;
   additionnalElem?: JSX.Element | undefined;
};

function AccordionList<List extends ListItemAvailable>({
   list,
   additionnalElem,
   name,
   refreshLists,
   expanded,
   ...args
}: AccordionListProps<List>) {
   const singularName = name
      .toLowerCase()
      .substring(0, name.length - 1) as UploadFileType;
   const [isClickedImport, setIsClickedImport] = useState(false);
   const [onDeleteName, setOndeleteName] = useState('');
   const { sendForm, isLoading: isDeleting } = useSendForm({
      method: 'DELETE',
      url: ApiEndpoints.DELETE.list,
   });
   const isEmptyList = list.length > 0;

   const closeImportWindow = () => {
      setIsClickedImport(!isClickedImport);
      setTimeout(() => refreshLists(), 1000);
   };

   const handleDeletion = (fileName: string): void => {
      sendForm({ data: { fileName, type: singularName } });
      setOndeleteName(fileName);
      setTimeout(() => refreshLists(), 1000);
   };

   return (
      <>
         <Paper>
            <Accordion expanded={expanded} {...args}>
               <AccordionSummary
                  expandIcon={!expanded && <ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="flex justify-between"
               >
                  <Typography sx={{ marginTop: 0.5 }}>{name}</Typography>
                  {additionnalElem && (
                     <div className="p-0 m-0">{additionnalElem}</div>
                  )}
                  <Button
                     className="ml-auto h-[15px] w-[100px]"
                     onClick={() => setIsClickedImport(!isClickedImport)}
                  >
                     Import {singularName}
                  </Button>
               </AccordionSummary>
               <AccordionDetails>
                  <Table>
                     <TableBody>
                        {isEmptyList ? (
                           <>
                              <TableRow>
                                 <TableCell>Name</TableCell>
                              </TableRow>
                              {list.map(
                                 ({
                                    item,
                                    canBeDeleted: showDeleteBtn,
                                    bindTo,
                                 }) => (
                                    <Raw
                                       deleteDisabled={!showDeleteBtn}
                                       key={item.name}
                                       item={item}
                                       handleDeletion={handleDeletion}
                                       isLoading={
                                          isDeleting &&
                                          onDeleteName === item.name
                                       }
                                       bindToTasks={bindTo}
                                    />
                                 ),
                              )}
                           </>
                        ) : (
                           <TableRow>
                              <TableCell component="th" scope="row">
                                 No items found
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </AccordionDetails>
            </Accordion>
         </Paper>
         {isClickedImport && (
            <BackgroundBlur
               toggleFn={() => setIsClickedImport(!isClickedImport)}
            >
               <ImportList
                  closeImportWindow={closeImportWindow}
                  type={singularName}
               />
            </BackgroundBlur>
         )}
      </>
   );
}

export default AccordionList;

AccordionList.defaultProps = {
   expanded: undefined,
   additionnalElem: undefined,
};
