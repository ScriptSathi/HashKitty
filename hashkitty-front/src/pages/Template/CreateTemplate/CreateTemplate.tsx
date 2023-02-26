import React, { ChangeEvent, Component, FormEvent } from 'react';

import './CreateTemplate.scss';

import { Constants } from '../../../Constants';
import { Utils } from '../../../Utils';
import {
    InputAttackModes,
    InputBreakpointTemp,
    InputCPUOnly,
    InputKernelOpti,
    InputName,
    InputPotfiles,
    InputRules,
    InputWordlist,
    InputWorkloadProfiles,
} from '../../../components/Inputs/Inputs';
import { ErrorHandlingCreateTemplate } from '../../../ErrorHandlingCreateTemplate';
import { THashlist, TemplateTask, TAttackMode } from '../../../types/TypesORM';
import {
    ApiOptionsFormData,
    ApiTemplateFormData,
    itemBase,
    templateFormData,
} from '../../../types/TComponents';
import { CreateTemplateProps, CreateTemplateState } from './TCreateTemplate';
import Button from '../../../components/ui/Button/Button';
import ImportHashList from '../../../components/ImportHashList/ImportHashList';
import BackgroundBlur from '../../../components/ui/BackgroundBlur/BackGroundBlur';
import { RequestUtils, StandardResponse } from '../../../RequestUtils';

const defaultFormData = {
    formAttackModeId: -1,
    formCpuOnly: false,
    formRuleName: '',
    formMaskQuery: '',
    formMaskFileName: '',
    formPotfileName: '',
    formKernelOpti: false,
    formWordlistName: '',
    formWorkloadProfile: 3,
    formBreakpointGPUTemperature: 90,
};

export default class CreateTemplate extends Component<
    CreateTemplateProps,
    CreateTemplateState
> {
    private inputsError: ErrorHandlingCreateTemplate;

    constructor(props: CreateTemplateProps) {
        super(props);
        this.inputsError = new ErrorHandlingCreateTemplate();

        this.state = {
            inputsErrorCheck: this.inputsError.results,
            toggleNewTask: props.toggleNewTask,
            hashlistCreationToggle: false,
            formHasErrors: false,
            isMouseIn: false,
            templateCheckboxIsChecked: false,
            activePage: 0,
            templateTaskCheckBoxId: -1,
            hashlist: [],
            wordlists: [],
            attackModes: [],
            rules: [],
            potfiles: [],
            templateTasks: [],
            formName: '',
            importHashlistSuccessMessage: '',
            ...defaultFormData,
        };
    }

    public async componentDidMount(): Promise<void> {
        await this.fetchData();
    }

    public render() {
        return (
            <>
                <BackgroundBlur {...this.backgroundBlurProps}>
                    <div className="createTaskBody">
                        <div className="contentBody">
                            <div className="">
                                <p className="title">New Template</p>
                                <form
                                    onSubmit={this.handleSubmit}
                                    className="formBody"
                                >
                                    <article className="CarouselBody">
                                        <this.Pages />
                                    </article>
                                    <this.Buttons />
                                </form>
                            </div>
                        </div>
                    </div>
                </BackgroundBlur>
                <ImportHashList {...this.importListProps} />
            </>
        );
    }

    private get inputAttackModesProps() {
        return {
            state: this.state,
            handleInputChange: this.handleInputChange,
            biggerFonts: true,
        };
    }

    private get backgroundBlurProps() {
        return {
            isToggled: this.props.isToggled,
            toggleFn: this.props.toggleNewTask,
            centerContent: false,
        };
    }

    private get inputNameProps() {
        return {
            state: this.state,
            handleInputChange: this.handleInputChange,
        };
    }

    private get importListProps() {
        return {
            isToggled: this.state.hashlistCreationToggle,
            toggleFn: this.toggleHashlistCreation,
            handleImportHasSucced: this.importHashlistSuccess,
        };
    }

    private constructInputList(list: string[]): itemBase[] {
        return list.map((elem, i) => {
            return {
                name: elem,
                id: i,
            };
        });
    }

    private get form(): templateFormData {
        return {
            formName: this.state.formName,
            formAttackModeId: this.state.formAttackModeId,
            formCpuOnly: this.state.formCpuOnly,
            formRuleName: this.state.formRuleName,
            formMaskQuery: this.state.formMaskQuery,
            formPotfileName: this.state.formPotfileName,
            formKernelOpti: this.state.formKernelOpti,
            formWordlistName: this.state.formWordlistName,
            formWorkloadProfile: this.state.formWorkloadProfile,
            formBreakpointGPUTemperature:
                this.state.formBreakpointGPUTemperature,
            formMaskFileName: this.state.formMaskFileName,
        };
    }

    private handleInputChange = (
        event:
            | ChangeEvent<HTMLInputElement>
            | (React.MouseEvent<HTMLInputElement, MouseEvent> &
                  ChangeEvent<HTMLInputElement>)
    ) => {
        if (event.target.name !== '' && event.target.name in this.state) {
            const target = event.target;
            let value = Utils.santizeInput(event);
            if (target.name === 'formWorkloadProfile') {
                value = parseInt(value as string) || 1;
                if (value < 1) value = 1;
                else if (value > 4) value = 4;
            }
            if (target.name === 'formBreakpointGPUTemperature') {
                value = parseInt(value as string) || 0;
                if (value < 0) value = 0;
                else if (value > 110) value = 110;
            }
            if (target.name === 'formAttackModeId') {
                if (this.state.templateCheckboxIsChecked) {
                    const templateTask = this.state.templateTasks.find(
                        templateTask => {
                            return (
                                templateTask.id ===
                                this.state.templateTaskCheckBoxId
                            );
                        }
                    );
                    value =
                        templateTask?.options.attackModeId.id ||
                        this.state.attackModes[0].id;
                } else {
                    value = parseInt(value as string);
                }
            }
            this.setState({
                [target.name]: value,
            } as Pick<templateFormData, keyof templateFormData>);
        }
    };

    private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.inputsError.analyse(this.form, {
            attackModes: this.state.attackModes,
            hashlist: this.state.hashlist,
            wordlist: this.state.wordlists,
            rules: this.state.rules,
            potfiles: this.state.potfiles,
        });
        this.setState({
            inputsErrorCheck: this.inputsError.results,
            formHasErrors: this.inputsError.hasErrors,
        });
        if (!this.inputsError.hasErrors) {
            const options: ApiOptionsFormData = {
                attackModeId: this.state.formAttackModeId,
                breakpointGPUTemperature:
                    this.state.formBreakpointGPUTemperature,
                wordlistName: this.state.formWordlistName,
                workloadProfileId: this.state.formWorkloadProfile,
                kernelOpti: this.state.formKernelOpti,
                CPUOnly: this.state.formCpuOnly,
                potfileName: this.state.formPotfileName,
                ruleName: this.state.formRuleName,
                maskQuery: this.state.formMaskQuery,
                maskFilename: this.state.formMaskFileName,
            };
            this.submitForm({
                name: this.state.formName,
                description: 'test',
                options,
            });
        }
    };

    private submitForm(form: ApiTemplateFormData): void {
        RequestUtils.POST<StandardResponse>(
            Constants.apiPOSTCreateTemplate,
            form,
            res => {
                let isError = true;
                if (res.success) isError = false;
                this.props.handleTemplateCreation(res.message, isError);
                this.state.toggleNewTask();
            }
        );
    }

    private toggleHashlistCreation = () => {
        this.setState({
            hashlistCreationToggle: !this.state.hashlistCreationToggle,
        });
        this.state.hashlistCreationToggle
            ? (document.body.style.overflow = 'hidden')
            : (document.body.style.overflow = 'visible');
    };

    private importHashlistSuccess = () => {
        this.setState({
            importHashlistSuccessMessage: 'Successfull import',
        });
        this.fetchData();
        this.toggleHashlistCreation();
    };

    private async fetchData(): Promise<void> {
        const hashlist = await Utils.fetchListWithEndpoint<THashlist>(
            Constants.apiGetHashlists
        );
        const templateTasks = await Utils.fetchListWithEndpoint<TemplateTask>(
            Constants.apiGetTemplate
        );
        const rules = await Utils.fetchListWithEndpoint<string>(
            Constants.apiGetRules
        );
        const potfiles = await Utils.fetchListWithEndpoint<string>(
            Constants.apiGetPotfiles
        );
        const wordlists = await Utils.fetchListWithEndpoint<string>(
            Constants.apiGetWordlists
        );
        const attackModes = await Utils.fetchListWithEndpoint<TAttackMode>(
            Constants.apiGetAttackModes
        );

        this.setState({
            hashlist,
            templateTasks,
            rules: this.constructInputList(rules),
            potfiles: this.constructInputList(potfiles),
            wordlists: this.constructInputList(wordlists),
            attackModes,
        });
    }

    private nextFormStep = () => {
        this.setState({
            activePage: this.state.activePage + 1,
        });
    };

    private prevFormStep = () => {
        this.setState({
            activePage: this.state.activePage - 1,
        });
    };

    private get attackModeType() {
        const attackModes = this.state.attackModes.find(
            attackModes => attackModes.id === this.state.formAttackModeId
        );
        return attackModes?.mode || 0;
    }

    private Buttons = () => {
        if (this.state.activePage === 0) {
            return (
                <Button
                    type="button"
                    className="submitInputCreateTask"
                    onClick={this.nextFormStep}
                >
                    Next
                </Button>
            );
        } else if (this.state.activePage === 1) {
            return (
                <div className="submitInputCreateTask buttonNextAndPrevDiv">
                    <Button type="button" onClick={this.prevFormStep}>
                        previous
                    </Button>
                    <Button type="button" onClick={this.nextFormStep}>
                        Next
                    </Button>
                </div>
            );
        } else {
            return (
                <div className="submitInputCreateTask buttonNextAndPrevDiv">
                    <Button type="button" onClick={this.prevFormStep}>
                        previous
                    </Button>
                    <Button
                        type="submit"
                        onClick={(e: unknown) =>
                            this.handleSubmit(e as FormEvent<HTMLFormElement>)
                        }
                    >
                        Create template
                    </Button>
                </div>
            );
        }
    };

    private PageTwo = () => {
        const inputOptions = {
            state: this.state,
            handleInputChange: this.handleInputChange,
        };
        switch (this.attackModeType) {
            case 0:
                return (
                    <>
                        <InputWordlist {...inputOptions} required={false} />
                        <InputRules {...inputOptions} />
                        <InputPotfiles {...inputOptions} />
                    </>
                );
            case 1:
                return (
                    <>
                        <InputWordlist {...inputOptions} />
                        <InputRules {...inputOptions} />
                        <InputPotfiles {...inputOptions} />
                    </>
                );
            case 3:
                return (
                    <>
                        <InputWordlist {...inputOptions} />
                        <InputRules {...inputOptions} />
                        <InputPotfiles {...inputOptions} />
                    </>
                );
            case 6:
                return (
                    <>
                        <InputWordlist {...inputOptions} />
                        <InputRules {...inputOptions} />
                        <InputPotfiles {...inputOptions} />
                    </>
                );
            case 7:
                return (
                    <>
                        <InputWordlist {...inputOptions} />
                        <InputRules {...inputOptions} />
                        <InputPotfiles {...inputOptions} />
                    </>
                );
            case 9:
                return (
                    <>
                        <InputWordlist {...inputOptions} />
                        <InputRules {...inputOptions} />
                        <InputPotfiles {...inputOptions} />
                    </>
                );
            default:
                return (
                    <>
                        <InputWordlist {...inputOptions} />
                        <InputRules {...inputOptions} />
                        <InputPotfiles {...inputOptions} />
                    </>
                );
        }
    };

    private Pages = () => {
        if (this.state.activePage === 0) {
            const inputAttackModesProps = {
                state: this.state,
                handleInputChange: this.handleInputChange,
                biggerFonts: true,
            };
            return (
                <>
                    <div className="">
                        <InputName {...this.inputNameProps} />
                    </div>
                    <div className="sectionTemplate contentTopCenter active marginTop5">
                        <InputAttackModes {...inputAttackModesProps} />
                    </div>
                </>
            );
        } else if (this.state.activePage === 1) {
            return (
                <div className="flexColumn gap10 width100P active">
                    <this.PageTwo />
                </div>
            );
        } else {
            const inputOptions = {
                state: this.state,
                handleInputChange: this.handleInputChange,
            };
            return (
                <div className="flexColumn gap10 width100P active">
                    <InputCPUOnly {...inputOptions} />
                    <InputKernelOpti
                        state={this.state}
                        handleInputChange={this.handleInputChange}
                    />
                    <InputBreakpointTemp {...inputOptions} />
                    <InputWorkloadProfiles {...inputOptions} />
                </div>
            );
        }
    };
}
