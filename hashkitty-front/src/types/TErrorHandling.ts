export type fieldError = {
    isError: boolean;
    message: string;
    itemId: number;
};

export type CreateTaskKeyErrors =
    | 'formAttackModeId'
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

export type HashlistKeyErrors =
    | 'formHashlist'
    | 'formName'
    | 'formHashtypeName';

export type newTaskInputsError = {
    [key in CreateTaskKeyErrors]: fieldError;
};

export type newHashlistInputsError = {
    [key in HashlistKeyErrors]: fieldError;
};
