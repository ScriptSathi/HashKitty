import React from 'react';
import { ChangeEvent } from 'react';

import './Inputs.scss';
import InputDropdown from '../InputDropDown/InputDropdown';
import { inputDatalist } from '../CreateTask/TCreateTask';
import { GenericForm } from '../../types/TForm';
import { fieldError } from '../../types/TErrorHandling';
import { TDBData } from '../../types/TypesORM';
import { newTHashlistFormData, newTaskFormData } from '../../types/TComponents';
import Button from '../Button/Button';

type InputsState<
    formName extends keyof newTaskFormData | keyof newTHashlistFormData,
    extraData = undefined
> = extraData &
    GenericForm<Record<formName, fieldError> & Record<'formName', fieldError>>;

export const InputAttackModes = ({
    state,
    handleInputChange,
}: {
    state: InputsState<
        'formAttackModeId',
        Pick<TDBData, 'attackModes'> & Pick<newTaskFormData, 'formAttackModeId'>
    >;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return state.attackModes.length > 0 ? (
        <div style={{ marginTop: 30 }}>
            <p className="noMargin labelsTitles">Choose an attack mode</p>
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
                        <label key={elem.id} className="fontMedium">
                            <input
                                className="inputRadio"
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
            <p className="noMargin labelsTitles">Choose an attack mode</p>
            <p>No attack modes loaded</p>
        </div>
    );
};

export const RenderTemplateTaskCheckBox = ({
    list,
    handleTemplateTaskCheckbox,
    state,
}: {
    state: { templateTaskCheckBoxId: number };
    handleTemplateTaskCheckbox: (e: ChangeEvent<HTMLInputElement>) => void;
} & Pick<inputDatalist, 'list'>) => {
    return (
        <label className="labelsTitles">
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

export const InputWordlist = ({
    state,
    handleInputChange,
}: {
    state: InputsState<
        'formWordlistName',
        Pick<TDBData, 'wordlists'> & Pick<newTaskFormData, 'formAttackModeId'>
    >;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="noMarginBottom labelsTitles">
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

export const InputRules = ({
    state,
    handleInputChange,
}: {
    state: InputsState<'formRuleName', Pick<TDBData, 'rules'>>;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="noMarginBottom labelsTitles">
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

export const InputPotfiles = ({
    state,
    handleInputChange,
}: {
    state: InputsState<'formPotfileName', Pick<TDBData, 'potfiles'>>;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="noMarginBottom labelsTitles">
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

export const InputHashlist = ({
    state,
    handleInputChange,
    buttonClick,
    importMessage,
}: {
    state: InputsState<'formHashlistName', Pick<TDBData, 'hashlist'>>;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    buttonClick: () => void;
    importMessage: string;
}) => {
    return (
        <div>
            <div className="divGridSplit labelsTitles">
                Choose a hashlist
                <Button onClick={buttonClick} className="importHashlist">
                    Import
                </Button>
                <p className="colorGreen noMargin smallTxt">{importMessage}</p>
            </div>
            <label
                className="noMarginBottom labelsTitles"
                style={{ display: 'grid' }}
            >
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
        </div>
    );
};

export const InputName = ({
    state,
    handleInputChange,
}: {
    state: InputsState<'formName', Pick<newTaskFormData, 'formName'>>;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="noMarginBottom labelsTitles">
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
                placeholder="Choose a name"
                className="inputs inputName"
                value={state.formName}
                name="formName"
                onChange={event => handleInputChange(event)}
            ></input>
        </label>
    );
};

export const InputWorkloadProfiles = ({
    state,
    handleInputChange,
}: {
    state: InputsState<
        'formWorkloadProfile',
        Pick<newTaskFormData, 'formWorkloadProfile'>
    >;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="noMarginBottom labelsTitles">
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

export const InputHashtypes = ({
    state,
    handleInputChange,
}: {
    state: InputsState<
        'formHashtypeName',
        Pick<newTHashlistFormData, 'formHashtypeName'> &
            Pick<TDBData, 'hashtypes'>
    >;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="noMarginBottom labelsTitles">
            Type of the hashs
            <p
                className={
                    state.formHasErrors &&
                    state.inputsErrorCheck.formName.isError
                        ? 'isError noMargin'
                        : 'hideBlock noMargin'
                }
            >
                {state.inputsErrorCheck.formHashtypeName.message}
            </p>
            <InputDropdown
                list={state.hashtypes}
                formName="formHashtypeName"
                handleInputChange={event => handleInputChange(event)}
                hashTypeFormat={true}
                placeholder="Name of the hashs type's"
            />
        </label>
    );
};

export const InputBreakpointTemp = ({
    state,
    handleInputChange,
}: {
    state: InputsState<
        'formBreakpointGPUTemperature',
        Pick<newTaskFormData, 'formBreakpointGPUTemperature'>
    >;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="noMarginBottom labelsTitles">
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

export const InputKernelOpti = ({
    state,
    handleInputChange,
}: {
    state: InputsState<
        'formKernelOpti',
        Pick<newTaskFormData, 'formKernelOpti'>
    >;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="flexBox noMarginBottom labelsTitles">
            <input
                type="checkbox"
                value="true"
                name="formKernelOpti"
                checked={state.formKernelOpti}
                className="inputCheckbox marginRight5 marginTop2"
                onChange={event => handleInputChange(event)}
            ></input>
            Kernel optimization (default: No)
        </label>
    );
};

export const InputCPUOnly = ({
    state,
    handleInputChange,
}: {
    state: InputsState<'formCpuOnly', Pick<newTaskFormData, 'formCpuOnly'>>;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <label className="flexBox noMarginBottom labelsTitles">
            <input
                type="checkbox"
                value="true"
                name="formCpuOnly"
                checked={state.formCpuOnly}
                className="inputCheckbox marginRight5 marginTop2"
                onChange={event => handleInputChange(event)}
            ></input>
            CPU Only (default: No)
        </label>
    );
};
