import { Accordion, AccordionDetails, AccordionSummary, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ItemBase } from "../../../types/TComponents";
import Button from "../Buttons/Button";
import { useState } from "react";
import BackgroundBlur from "../BackgroundBlur/BackGroundBlur";
import ImportList from "../../ImportList/ImportList";
import { UploadFileType } from "../../../types/TApi";
import DeleteButton from "../Buttons/DeleteButton";
import useSendForm from "../../../hooks/useSendForm";
import ApiEndpoints from "../../../ApiEndpoints";

type AccordionListProps = {
   list: ItemBase[];
   name: string;
   refreshLists: () => void;
};

function AccordionList({ list, name, refreshLists }: AccordionListProps) {
   const singularName = name.toLowerCase().substring(0, name.length-1) as UploadFileType;
   const [isClickedImport, setIsClickedImport] = useState(false);
   const [onDeleteName, setOndeleteName] = useState('');
   const { sendForm, isLoading } = useSendForm({
      method: 'DELETE',
      url: ApiEndpoints.DELETE.list,
   });

   const closeImportWindow = () => {
      setIsClickedImport(!isClickedImport);
      setTimeout(() => refreshLists(), 1000);
   };

   const handleDeletion = (fileName: string): void => {
      sendForm(
         { data: { fileName, type: singularName }}
      );
      setOndeleteName(fileName);
   };

   function Raws() {
      if(list.length === 0) {
         return (
            <TableRow>
               <TableCell component="th" scope="row">
                  No items found
               </TableCell>
            </TableRow>
         )
      }
      return (
         <>
            <TableRow>
               <TableCell>Name</TableCell>
            </TableRow>
            {list.map( item => (
               <TableRow key={item.name}>
                  <TableCell component="th" scope="row">
                     <div className='flex items-center justify-between'>
                        <p>{item.name}</p>
                        <DeleteButton isLoading={isLoading && onDeleteName === item.name} handleDeletion={() => handleDeletion(item.name)}/>
                     </div>
                  </TableCell>
               </TableRow>
            ))}
         </>
      );
   }
   return (
      <>
         <Paper>
            <Accordion>
               <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="flex justify-between"
               >
                  <Typography sx={{ marginTop: 0.3, }}>{name}</Typography>
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
                     <Raws/>
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
   )
}

export default AccordionList;