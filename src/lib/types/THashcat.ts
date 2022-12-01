export type THashcatOption = {
    name: string;
    arg: string | number;
};

export interface IHashcat {
    generateCmd(): string;
    generateBenchmarkCmd(): string;
}
