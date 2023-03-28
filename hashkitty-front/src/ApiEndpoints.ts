export default class ApiEndpoints {
   public static readonly mandatoryFetchOptions = {} satisfies RequestInit;
   public static readonly domaineName =
      import.meta.env?.REACT_APP_API_ENDPOINT || 'localhost';
   public static readonly apiPort =
      import.meta.env?.REACT_APP_API_PORT || '1337';
   public static readonly endpoint = '/api';
   public static readonly apiUrl: string = `http://${this.domaineName}:${this.apiPort}${this.endpoint}`;
   public static readonly apiPOSTAddList: string = `${this.apiUrl}/list`;
   public static readonly apiNotifications: string = `${this.apiUrl}/notifications`;
   public static get GET() {
      return {
         notifications: `${this.apiUrl}/notifications`,
         stopTask: `${this.apiUrl}/stop`,
         taskStatus: `${this.apiUrl}/status`,
         wordlists: `${this.apiUrl}/wordlists`,
         potfiles: `${this.apiUrl}/potfiles`,
         attackmodes: `${this.apiUrl}/attackmodes`,
         hashtypes: `${this.apiUrl}/hashtypes`,
         hashlists: `${this.apiUrl}/hashlists`,
         rules: `${this.apiUrl}/rules`,
         tasks: `${this.apiUrl}/tasks`,
         templates: `${this.apiUrl}/template`,
      };
   }
   public static get DELETE() {
      return {
         list: `${this.apiUrl}/list`,
         task: `${this.apiUrl}/tasks`,
         template: `${this.apiUrl}/template`,
      };
   }
   public static get POST() {
      return {
         list: `${this.apiUrl}/list`,
         startTask: `${this.apiUrl}/start`,
         task: `${this.apiUrl}/tasks`,
         taskResults: `${this.apiUrl}/results`,
         restore: `${this.apiUrl}/restore`,
      };
   }
}
