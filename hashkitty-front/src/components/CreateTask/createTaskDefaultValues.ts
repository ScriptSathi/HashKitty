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
   customCharset1: '',
   customCharset2: '',
   customCharset3: '',
   customCharset4: '',
} satisfies CreateTaskForm;

export default createTaskDefaultValues;
