import type { TTemplate } from './types/TypesORM';

const tooltips = {
   inputs: {
      name: (fieldType: string) => `The name of the ${fieldType}`,
      templates: (template: TTemplate) => [
         `Name: ${template.name}`,
         `Attack mode: ${template.options.attackModeId.mode}`,
         `Wordlist: ${template.options.wordlistId.name}`,
         `MaskQuery: ${template.options.maskQuery || 'None'}`,
      ],
      attackModes: {
         0: 'Change me pls :3',
         1: 'Change me pls :3',
         3: 'Change me pls :3',
         6: 'Change me pls :3',
         7: 'Change me pls :3',
         9: 'Change me pls :3',
      },
      breakpointGPUTemperature: 'Change me pls :3',
      wordlistName: 'Change me pls :3',
      workloadProfile: 'Change me pls :3',
      kernelOpti: 'Change me pls :3',
      CPUOnly: 'Change me pls :3',
      rules: 'Change me pls :3',
      potfileName: 'Change me pls :3',
      maskQuery: 'Change me pls :3',
      maskFilename: 'Change me pls :3',
   },
   lists: {
      rules: [
         {
            text: 'Best64 : A very common rule you can use',
            link: 'https://github.com/hashcat/hashcat/blob/master/rules/best64.rule',
         },
      ],
      wordlist:
         'If your file is bigger than 2 Go, you can put it inside the wordlist directory in the server, ' +
         'then click on the reload button beside',
   },
};

export default tooltips;
