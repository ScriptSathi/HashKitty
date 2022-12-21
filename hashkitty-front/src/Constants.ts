export class Constants {
    public static readonly domaineName = 'localhost';
    public static readonly apiPort: number = 1337;
    public static readonly endpoint = '/api';
    public static readonly apiUrl: string = `http://localhost:${this.apiPort}${this.endpoint}`;
    public static readonly apiGetTasks: string = `${this.apiUrl}/tasks`;
    public static readonly apiGetStatus: string = `${this.apiUrl}/status`;
    public static readonly apiGetHashlists: string = `${this.apiUrl}/hashlists`;
    public static readonly apiPOSTStart: string = `${this.apiUrl}/start`;
    public static readonly apiPOSTCreateTask: string = `${this.apiUrl}/tasks`;
    public static readonly apiGetTemplateTasks: string = `${this.apiUrl}/templatetasks`;
}
