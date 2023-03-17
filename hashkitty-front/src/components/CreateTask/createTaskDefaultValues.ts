import { CreateTaskForm } from '../../types/TComponents';

const createTaskDefaultValues: CreateTaskForm = {
   name: '',
   hashlistName: '',
   attackModeId: '',
   cpuOnly: false,
   rules: [],
   maskQuery: '',
   maskFileName: '',
   potfileName: '',
   kernelOpti: false,
   wordlistName: '',
   workloadProfile: 3,
   breakpointGPUTemperature: 90,
   templateId: -1,
};

export default createTaskDefaultValues;
