import { CreateTaskForm } from '../../types/TComponents';

const createTaskDefaultValues = {
   name: '',
   hashlistName: '',
   attackModeId: '',
   cpuOnly: false,
   rules: [],
   maskQuery: '',
   maskFileName: '',
   combinatorWordlistName: '',
   potfileName: '',
   kernelOpti: false,
   wordlistName: '',
   workloadProfile: '3',
   breakpointGPUTemperature: '90',
   templateId: '-1',
} satisfies CreateTaskForm;

export default createTaskDefaultValues;
