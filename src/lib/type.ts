export interface Character {
  name: string;
  hp: number;
  maxHp: number;
  extensions: Extension[];
  skills: Skill[];
  state: "idle" | "attack" | "defend" | "useSkill";
}

export type Extension = {
  name: string;
  modifyDamage?: (base: number) => number;
  onReceive?: (character: Character) => void;
};

export type Skill = {
  name: string;
  execute: (user: Character, target?: Character) => string;
};

export type Visitor = {
  visitAttack: (attacker: Character, defender: Character) => string;
  visitDefend: (character: Character) => string;
};
