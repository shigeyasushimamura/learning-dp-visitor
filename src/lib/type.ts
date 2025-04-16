export interface ICombatStatusEffect {
  name: string;
  modifyDamage?: (base: number) => number;
  onReceive?: (character: Character) => void;
}

export interface ISkill {
  name: string;
  execute: (user: Combatant, target?: Combatant) => string;
}

export interface IStatusEffectHolder {
  getStatusEffects(): ICombatStatusEffect[];
  addStatusEffect(effect: ICombatStatusEffect): void;
}

export interface ISkillHolder {
  getSkills(): ISkill[];
  addSkill(skill: ISkill): void;
}

// 最小限の共通情報のみを持つキャラ定義
export interface Character {
  name: string;
  hp: number;
  maxHp: number;
}

export type Visitor = {
  visitAttack: (attacker: Combatant, defender: Combatant) => string;
  visitDefend: (character: Combatant) => string;
};

// 戦闘可能キャラクター
export interface Combatant
  extends Character,
    IStatusEffectHolder,
    ISkillHolder {
  state: "idle" | "attack" | "defend" | "useSkill";
}
