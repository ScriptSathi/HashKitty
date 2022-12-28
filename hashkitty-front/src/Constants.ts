export class Constants {
    public static readonly domaineName = 'localhost';
    public static readonly apiPort: number = 1337;
    public static readonly endpoint = '/api';
    public static readonly apiUrl: string = `http://hashkitty-back:${this.apiPort}${this.endpoint}`;
    public static readonly apiGetTasks: string = `${this.apiUrl}/tasks`;
    public static readonly apiGetStatus: string = `${this.apiUrl}/status`;
    public static readonly apiGetHashlists: string = `${this.apiUrl}/hashlists`;
    public static readonly apiPOSTStart: string = `${this.apiUrl}/start`;
    public static readonly apiPOSTCreateTask: string = `${this.apiUrl}/tasks`;
    public static readonly apiGetTemplateTasks: string = `${this.apiUrl}/templatetasks`;
    public static readonly apiGetRules: string = `${this.apiUrl}/rules`;
    public static readonly apiGetPotfiles: string = `${this.apiUrl}/potfiles`;
    public static readonly apiGetWordlists: string = `${this.apiUrl}/wordlists`;
    public static readonly apiGetAttackModes: string = `${this.apiUrl}/attackmodes`;
    public static readonly apiGetHashTypes: string = `${this.apiUrl}/hashtypes`;
}
