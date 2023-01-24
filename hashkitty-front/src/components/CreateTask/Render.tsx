import { ChangeEvent } from 'react';
import InputDropdown from '../InputDropDown./InputDropdown';
import { CreateTaskState, inputDatalist } from './TCreateTask';

export const RenderLabelAttackModes = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return state.attackModes.length > 0 ? (
        <div style={{ marginTop: 30 }}>
            <p className="noMargin">Choose an attack mode</p>
            <p
                className={
                    state.formHasErrors
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formAttackModeId.message}
            </p>
            <div className="divRadio">
                {state.attackModes.map(elem => {
                    return (
                        <label key={elem.id}>
                            <input
                                className="inputCheckboxes"
                                type="radio"
                                name="formAttackModeId"
                                value={elem.id}
                                checked={state.formAttackModeId === elem.id}
                                onChange={event => handleInputChange(event)}
                            ></input>
                            {`${elem.mode} - ${elem.name}`}
                        </label>
                    );
                })}
            </div>
        </div>
    ) : (
        <div style={{ marginTop: 30 }}>
            <p className="noMargin">Choose an attack mode</p>
            <p>No attack modes loaded</p>
        </div>
    );
};

export const RenderTemplateTaskCheckBox = ({
    list,
    handleTemplateTaskCheckbox,
    state,
}: {
    state: CreateTaskState;
    handleTemplateTaskCheckbox: (e: ChangeEvent<HTMLInputElement>) => void;
} & Pick<inputDatalist, 'list'>) => {
    return (
        <label>
            Choose a template
            {list.length > 0 ? (
                <div className="divCheckbox">
                    {list.map(elem => {
                        return (
                            <label key={elem.id}>
                                <input
                                    className="templateInputCheckbox"
                                    type="checkbox"
                                    checked={
                                        state.templateTaskCheckBoxId === elem.id
                                    }
                                    name={`${elem.id}`}
                                    value={elem.name}
                                    onChange={e =>
                                        handleTemplateTaskCheckbox(e)
                                    }
                                ></input>
                                {elem.name.length > 20
                                    ? elem.name.slice(0, 17) + '...'
                                    : elem.name}
                            </label>
                        );
                    })}
                </div>
            ) : (
                <p>No template tasks loaded</p>
            )}
        </label>
    );
};

export const RenderAdvancedConfigButton = ({
    toggleOptionCreation,
    toggleIcon,
}: {
    toggleOptionCreation: () => void;
    toggleIcon: string;
}) => {
    return (
        <div className="advancedConfigs" onClick={toggleOptionCreation}>
            <img
                className="advancedConfigsImg"
                src={toggleIcon}
                alt="options icon"
            />
            <p className="advancedConfigsTxt">Advanced configs</p>
        </div>
    );
};

export const RenderLabelWordlist = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            Choose a wordlist
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formWordlistName.message}
            </p>
            <InputDropdown
                list={state.wordlists}
                formName="formWordlistName"
                handleInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e)
                }
            />
        </label>
    );
};

export const RenderLabelRules = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            Choose a rule
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formRuleName.message}
            </p>
            <InputDropdown
                list={state.rules}
                formName="formRuleName"
                handleInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e)
                }
            />
        </label>
    );
};

export const RenderLabelPotfiles = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            Choose a potfile
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formPotfileName.message}
            </p>
            <InputDropdown
                list={state.potfiles}
                formName="formPotfileName"
                handleInputChange={event => handleInputChange(event)}
            />
        </label>
    );
};

export const RenderLabelHashlist = ({
    state,
    handleInputChange,
    buttonClick,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    buttonClick: () => void;
}) => {
    return (
        <label className="labels" style={{ display: 'grid' }}>
            <div className="divGridSplit">
                Choose a hashlist
                <input
                    className="importHashlist"
                    onClick={buttonClick}
                    type="button"
                    value="import"
                ></input>
            </div>
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formHashlistName.message}
            </p>
            <InputDropdown
                list={state.hashlist}
                formName="formHashlistName"
                handleInputChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e)
                }
            />
        </label>
    );
};

export const RenderLabelName = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            Name
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formName.message}
            </p>
            <input
                type="text"
                placeholder="Task name"
                className="inputs inputName"
                value={state.formName}
                name="formName"
                onChange={event => handleInputChange(event)}
            ></input>
        </label>
    );
};

export const RenderLabelWorkloadProfiles = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            Workload profile (default: 3)
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formWorkloadProfile.message}
            </p>
            <input
                type="number"
                className="inputs"
                placeholder="Workload profile"
                style={{
                    width: '50px',
                    display: 'block',
                    marginTop: 10,
                }}
                value={state.formWorkloadProfile}
                name="formWorkloadProfile"
                onChange={event => handleInputChange(event)}
            ></input>
        </label>
    );
};

export const RenderLabelBreakpointTemp = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            Breakpoint Temperature (default: 90)
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formBreakpointGPUTemperature.message}
            </p>
            <input
                type="number"
                placeholder="Breakpoint Temperature"
                className="inputs"
                style={{
                    width: '50px',
                    display: 'block',
                    marginTop: 10,
                }}
                value={state.formBreakpointGPUTemperature}
                name="formBreakpointGPUTemperature"
                onChange={event => handleInputChange(event)}
            ></input>
        </label>
    );
};

export const RenderLabelKernelOpti = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            <input
                type="checkbox"
                value="true"
                name="formKernelOpti"
                checked={state.formKernelOpti}
                className="inputCheckbox"
                onChange={event => handleInputChange(event)}
            ></input>
            Kernel optimization (default: No)
        </label>
    );
};

export const RenderLabelCPUOnly = ({
    state,
    handleInputChange,
}: {
    state: CreateTaskState;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="labels">
            <input
                type="checkbox"
                value="true"
                name="formCpuOnly"
                checked={state.formCpuOnly}
                className="inputCheckbox"
                onChange={event => handleInputChange(event)}
            ></input>
            CPU Only (default: No)
        </label>
    );
};
