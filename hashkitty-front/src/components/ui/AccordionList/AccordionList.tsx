import {
   Accordion,
   AccordionDetails,
   AccordionSummary,
   Paper,
   SnackbarContent,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableRow,
   Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useState } from 'react';
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
import ColorModeContext from '../../../App/ColorModeContext';

type AccordionListProps<List extends ListItemAvailable> = {
   list: ListItem<List>[];
   name: string;
   refreshLists: () => void;
   expanded?: boolean;
   additionnalTitleBarElem?: JSX.Element | undefined;
   additionnalStack?: {
      text: string;
      link: string;
   }[];
   displayAdditionnalStack?: boolean;
};

function AccordionList<List extends ListItemAvailable>({
   list,
   additionnalTitleBarElem,
   name,
   refreshLists,
   expanded,
   additionnalStack,
   displayAdditionnalStack,
   ...args
}: AccordionListProps<List>) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
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

   const closeImportWindow = (doRefresh = false) => {
      setIsClickedImport(!isClickedImport);
      if (doRefresh) setTimeout(() => refreshLists(), 1000);
   };

   const handleDeletion = (fileName: string): void => {
      sendForm({ data: { fileName, type: singularName } });
      setOndeleteName(fileName);
      setTimeout(() => refreshLists(), 1000);
   };

   return (
      <>
         <Paper
            sx={{
               boxShadow: 'none',
               maxWidth: 700,
               backgroundColor: colors.secondary,
               color: colors.font,
            }}
         >
            <Accordion
               expanded={expanded}
               {...args}
               sx={{
                  backgroundColor: colors.secondary,
                  color: colors.font,
               }}
            >
               <AccordionSummary
                  expandIcon={
                     !expanded && <ExpandMoreIcon sx={{ color: colors.font }} />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="flex justify-between"
               >
                  <Typography sx={{ marginTop: 0.5 }}>{name}</Typography>
                  {additionnalTitleBarElem && (
                     <div className="p-0 my-0 ml-[10px]">
                        {additionnalTitleBarElem}
                     </div>
                  )}
                  <Button
                     className="w-fit text-xs font-bold"
                     sizeBorder="medium"
                     sx={{
                        marginTop: 0.5,
                        marginLeft: 'auto',
                        height: 15,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                     }}
                     onClick={e => {
                        e.stopPropagation();
                        setIsClickedImport(!isClickedImport);
                     }}
                  >
                     Import {singularName}
                  </Button>
               </AccordionSummary>
               <AccordionDetails>
                  {displayAdditionnalStack && (
                     <Stack spacing={0.5}>
                        {additionnalStack?.map(({ text, link }) => (
                           <SnackbarContent
                              key={link}
                              sx={{
                                 color: colors.main,
                                 backgroundColor: colors.intermediate1,
                              }}
                              message={
                                 <Typography
                                    className="m-0 p-0"
                                    style={{ color: colors.font }}
                                 >
                                    {text}{' '}
                                    <a
                                       className="cursor-pointer underline"
                                       style={{ color: colors.fontOpposite }}
                                       href={link}
                                    >
                                       {link}
                                    </a>
                                 </Typography>
                              }
                           />
                        ))}
                     </Stack>
                  )}
                  <Table>
                     <TableBody>
                        {isEmptyList ? (
                           <>
                              <TableRow>
                                 <TableCell sx={{ color: colors.font }}>
                                    Name
                                 </TableCell>
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
                              <TableCell
                                 sx={{ color: colors.font }}
                                 component="th"
                                 scope="row"
                              >
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
   additionnalTitleBarElem: undefined,
   displayAdditionnalStack: false,
   additionnalStack: [],
};
