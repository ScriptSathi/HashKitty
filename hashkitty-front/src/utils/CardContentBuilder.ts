import type { Options } from '../types/TypesORM';

export default class CardContentBuilder {
   public shortRaws: string[];
   public fullRaws: string[];

   constructor(option: Options, hashlistName?: string) {
      this.shortRaws = [];
      this.fullRaws = [];
      this.buildFullRaws(option, hashlistName);
   }

   public buildFullRaws(option: Options, hashlistName?: string): void {
      const raws = [];
      this.buildShortRaws(option, hashlistName);
      if (option.potfileName) raws.push(`Potfile : ${option.potfileName}`);
      if (option.CPUOnly) raws.push('CPU Only');
      if (option.kernelOpti) raws.push('Enable kernel optimization');
      this.fullRaws = [...this.shortRaws, ...raws];
   }

   private buildShortRaws(option: Options, hashlistName?: string): void {
      const isStraightAttack = option.attackModeId.mode === 0;
      const isCombinatorAttack = option.attackModeId.mode === 1;
      const isBFAttack = option.attackModeId.mode === 3;
      const isAssociationAttack = option.attackModeId.mode === 9;

      const maskQueryIsDefineOnValidAttackMode =
         !isStraightAttack &&
         !isAssociationAttack &&
         !isCombinatorAttack &&
         !!option.maskQuery;

      const rules = option.rules?.split(',').filter(e => e);
      const raws = [
         `Attack mode: ${option.attackModeId.mode} - ${option.attackModeId.name}`,
      ];
      if (hashlistName) raws.push(`Hashlist: ${hashlistName}`);
      if (!isBFAttack) raws.push(`Wordlist: ${option.wordlistId?.name}`);
      if (isCombinatorAttack)
         raws.push(
            `Combinator wordlist : ${option.combinatorWordlistId?.name}`,
         );
      if (maskQueryIsDefineOnValidAttackMode)
         raws.push(`Mask query : ${option.maskQuery}`);
      if (isBFAttack) {
         if (option.customCharset1)
            raws.push(`Custom charset 1 : ${option.customCharset1}`);
         if (option.customCharset2)
            raws.push(`Custom charset 2 : ${option.customCharset2}`);
         if (option.customCharset3)
            raws.push(`Custom charset 3 : ${option.customCharset3}`);
         if (option.customCharset4)
            raws.push(`Custom charset 4 : ${option.customCharset4}`);
      }
      if (rules && rules?.length > 0) {
         raws.push(
            `${rules.length > 1 ? 'Rules' : 'Rule'} : ${rules.join(', ')}`,
         );
      }
      this.shortRaws = raws;
   }
}
