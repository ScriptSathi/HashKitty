import React, { Component, CSSProperties } from 'react';

import Navbar from '../components/Navbar';
import newTask from '../assets/images/newTask.svg';
import '../assets/fonts/Inter-Bold.ttf';
import '../assets/styles/main.scss';
import '../assets/styles/HomePage.scss';
import NewTask from '../components/NewTask';
import CardTask from '../components/CardTask';
import { TTask } from '../types/TypesORM';

const toto: TTask[] = [
    {
        id: 97,
        name: 'uu6y3-0',
        description: '',
        createdAt: '2022-04-26',
        lastestModification: '2022-07-29',
        endeddAt: '',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 322,
            typeNumber: 6212,
            name: 'TrueCrypt RIPEMD160 + XTS 1024 bit (legacy)',
            description: 'Full-Disk Encryption (FDE)',
        },
        hashlistId: {
            id: 38,
            name: 'ZGggf-17',
            description: 'yJqi1PzsdfHZjeXX6h7RfoYGxrwbpnLrvasmuZz9ZXwLVAmNMe',
            path: '/0APTb/AOhu5/SoBcU/HPsGG',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 14,
        },
    },
    {
        id: 98,
        name: 'WWK2 E-1',
        description:
            '3P V MDGjwFJ m Gh j9JDAh G RR69ef7wqfgAoM4kqGgWV2s W 2F JWJc',
        createdAt: '2022-08-24',
        lastestModification: '2022-11-26',
        endeddAt: '2022-01-26',
        isfinished: 1,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 832,
            typeNumber: 9710,
            name: 'MS Office <= 2003 $0/$1, MD5 + RC4, collider #1',
            description: 'Document',
        },
        hashlistId: {
            id: 22,
            name: 'g5M8l-1',
            description: 'KIpIeiC5kGLsTJ6u9Yso6N2FRdMp1WNPzViT68Q8Q348Nbpwvo',
            path: '/wWFMU/RhuM7/HmVXQ/KSFKB',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 18,
        },
    },
    {
        id: 99,
        name: 'xwZan-2',
        description: '',
        createdAt: '2021-07-03',
        lastestModification: '2021-05-27',
        endeddAt: '',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 582,
            typeNumber: 14500,
            name: 'Linux Kernel Crypto API (2.4)',
            description: 'Raw Cipher, Known-plaintext attack',
        },
        hashlistId: {
            id: 35,
            name: 'JFhbD-14',
            description: 'habYcVR3JufYQcLbV2ixp9DbJ2xQZlsfCTui5upzWgebU5X2Jk',
            path: '/bm3P3/1A1HS/QfPqq/6UQkO',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 15,
        },
    },
    {
        id: 100,
        name: 't5Q1Z-3',
        description: '',
        createdAt: '2022-10-22',
        lastestModification: '2021-12-16',
        endeddAt: '2022-02-11',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 977,
            typeNumber: 610,
            name: 'BLAKE2b-512($pass.$salt)',
            description: 'Raw Hash salted and/or iterated',
        },
        hashlistId: {
            id: 15,
            name: 'Xq4IZ-14',
            description: '',
            path: '9reL8/lR8cj/jnpbt/e2gJy',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 1,
        },
    },
    {
        id: 101,
        name: 'daqOi-4',
        description: '',
        createdAt: '2021-01-31',
        lastestModification: '2022-01-15',
        endeddAt: '2022-05-18',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 119,
            typeNumber: 5400,
            name: 'IKE-PSK SHA1',
            description: 'Network Protocol',
        },
        hashlistId: {
            id: 27,
            name: '5wd81-5',
            description: 'maeL2Ob8eKLFLPgUIHflJcbsRYFXoqbjCpEMMUjchInp1JLmSK',
            path: '/GJpPt/PVQmP/XN1el/qFthA',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 15,
        },
    },
    {
        id: 102,
        name: 'kp48Q-5',
        description: '',
        createdAt: '2021-04-03',
        lastestModification: '2021-05-17',
        endeddAt: '2022-09-02',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 1431,
            typeNumber: 17600,
            name: 'SHA3-512',
            description: 'Raw Hash',
        },
        hashlistId: {
            id: 11,
            name: 'Gg1wC-10',
            description: '',
            path: 'VircA/syrLV/hGPAX/igGrX',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 9,
        },
    },
    {
        id: 103,
        name: 'ssFUB-6',
        description: '',
        createdAt: '2021-03-27',
        lastestModification: '2022-04-11',
        endeddAt: '',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 48,
            typeNumber: 30,
            name: 'md5(utf16le($pass).$salt)',
            description: 'Raw Hash salted and/or iterated',
        },
        hashlistId: {
            id: 16,
            name: 'oVeAB-15',
            description: '',
            path: '7v9Dc/Tdyik/qK0Og/mwaTb',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 0,
        },
    },
    {
        id: 104,
        name: '24H BE-7',
        description: '',
        createdAt: '2022-01-18',
        lastestModification: '2021-09-04',
        endeddAt: '',
        isfinished: 1,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 2357,
            typeNumber: 15200,
            name: 'Blockchain, My Wallet, V2',
            description: 'Cryptocurrency Wallet',
        },
        hashlistId: {
            id: 38,
            name: 'ZGggf-17',
            description: 'yJqi1PzsdfHZjeXX6h7RfoYGxrwbpnLrvasmuZz9ZXwLVAmNMe',
            path: '/0APTb/AOhu5/SoBcU/HPsGG',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 14,
        },
    },
    {
        id: 105,
        name: 'Qv2JR-8',
        description:
            'L1oaQlG44Y NVSS3qYrs xS yeo uR9Czcayk h 8P d dJ2C3G9 ZA uH ai ',
        createdAt: '2022-02-05',
        lastestModification: '2021-02-24',
        endeddAt: '',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 497,
            typeNumber: 6100,
            name: 'Whirlpool',
            description: 'Raw Hash',
        },
        hashlistId: {
            id: 40,
            name: 'hwUU9-19',
            description: 'lt07Yc5ifhP2HSc694OdUodkTxPCeiNGp5dEMdcLajhgKWiJMj',
            path: '/zOEq9/R976J/1R6bP/3A7If',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 17,
        },
    },
    {
        id: 106,
        name: 'e1 rbh-9',
        description:
            '1mHVuvRzDSUL J 75Rgl wVZjMJdspPBP6 fQQyX iF7p0aEC aJN HmR',
        createdAt: '2021-08-28',
        lastestModification: '2021-09-01',
        endeddAt: '',
        isfinished: 0,
        options: {
            id: 75,
            breakpointGPUTemperature: 67,
            kernelOpti: true,
            CPUOnly: true,
            ruleName: '',
            potfileName: '',
            maskQuery: '',
            maskFilename: '',
            wordlistId: {
                id: 1,
                name: 'bonjiyr',
                description: 'aa',
                path: 'test',
            },
            attackModeId: {
                id: 14,
                name: 'NRrfo',
                mode: 3,
            },
            workloadProfileId: {
                id: 2,
                profileId: 3,
                powerConsumation: 'GF A1AlcoSQ',
                desktopImpact: 'T5NvsPxvmU',
            },
        },
        templateTaskId: {
            id: 6,
            name: 'eQ X9s',
            description:
                'M cQq q44yd9NECnLS6NN06I9 tcrQ9 A8cYq85erfPA5 Z6Vp v1WwA ',
            createdAt: '2021-09-21',
            lastestModification: '2022-02-07',
        },
        hashTypeId: {
            id: 1253,
            typeNumber: 13733,
            name: 'VeraCrypt Whirlpool + XTS 1536 bit (legacy)',
            description: 'Full-Disk Encryption (FDE)',
        },
        hashlistId: {
            id: 24,
            name: 'SVf21-4',
            description: '8mbylahVUPoA93ax9tdy2OrslW0q8n0FGvw06l29Bt0lujrVQu',
            path: '/a8CzF/HGBfO/ysfPB/9wsPo',
            createdAt: '2022-12-08',
            lastestModification: '2022-12-08',
            numberOfCrackedPasswords: 15,
        },
    },
];
class HomePage extends Component {
    public state = {
        seen: false,
    };

    private toggleNewTask: () => void = () => {
        this.setState({
            seen: !this.state.seen,
        });
    };

    private renderCardTasks: () => CardTask[] = () => {
        return toto.map(task => {
            return (
                <CardTask
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    options={task.options}
                    hashTypeId={task.hashTypeId}
                    hashlistId={task.hashlistId}
                    createdAt={task.createdAt}
                    lastestModification={task.lastestModification}
                    description={task.description || ''}
                    templateTaskId={task.templateTaskId}
                    endeddAt={task.endeddAt}
                    isfinished={task.isfinished}
                />
            );
        });
    };

    render() {
        return (
            <div className="App">
                <Navbar />
                <div style={this.styles.mainBox}>
                    <div style={this.styles.LeftBox}>
                        <div style={this.styles.runningTasksTitle}>
                            <p>Running tasks</p>
                        </div>
                        <div style={this.styles.cardBody}>
                            <div style={this.styles.rowCards}>
                                {toto.map(task => {
                                    return (
                                        <CardTask
                                            key={task.id}
                                            id={task.id}
                                            name={task.name}
                                            options={task.options}
                                            hashTypeId={task.hashTypeId}
                                            hashlistId={task.hashlistId}
                                            createdAt={task.createdAt}
                                            lastestModification={
                                                task.lastestModification
                                            }
                                            description={task.description || ''}
                                            templateTaskId={task.templateTaskId}
                                            endeddAt={task.endeddAt}
                                            isfinished={task.isfinished}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                <img
                                    className="newTask"
                                    style={this.styles.newTask}
                                    src={newTask}
                                    alt="create a new task"
                                    onClick={this.toggleNewTask}
                                />
                                {this.state.seen ? (
                                    <NewTask toggle={this.toggleNewTask} />
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private styles: { [key: string]: CSSProperties } = {
        mainBox: {
            display: 'grid',
            gridTemplateColumns: 'minmax(auto, 69%) auto',
            marginTop: 100,
            paddingLeft: 60,
        },
        LeftBox: {
            border: '1px solid',
            borderLeftStyle: 'none',
            borderTopStyle: 'none',
            borderBottomStyle: 'none',
        },
        RightBox: {
            display: 'grid',
        },
        runningTasksTitle: {
            display: 'block',
            fontFamily: 'InterBold',
            fontSize: 24,
            paddingLeft: 50,
            height: 50,
            width: '100%',
        },
        cardBody: {
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'minmax(auto, 73%) auto',
        },
        rowCards: {
            display: 'grid',
            gap: 20,
            // gridRow: 1,
            // gridAutoRows: '445px',
            gridTemplateColumns: 'minmax(auto, 36%) auto',
            backgroundColor: 'black',
        },
        fakeCard: {
            display: 'grid',
            height: 309,
            width: 445,
            backgroundColor: 'blue',
            border: '1px solid',
        },
        fakeCard1: {
            display: 'grid',
            height: 309,
            width: 445,
            backgroundColor: 'yellow',
            border: '1px solid',
        },
        fakeCard2: {
            display: 'grid',
            height: 309,
            width: 445,
            backgroundColor: 'white',
            border: '1px solid',
        },
        newTask: {
            height: 310,
            width: 285,
        },
    };
}

export default HomePage;
