export type fieldError = {
    isError: boolean;
    message: string;
    itemId: number;
};

export type keyErrors =
    | 'formAttackMode'
    | 'formRuleName'
    | 'formMaskQuery'
    | 'formPotfileName'
    | 'formKernelOpti'
    | 'formWordlistName'
    | 'formWorkloadProfile'
    | 'formBreakpointGPUTemperature'
    | 'formCpuOnly'
    | 'formHashlistName'
    | 'formName';

export type newTaskInputsError = {
    [key in keyErrors]: fieldError;
};
