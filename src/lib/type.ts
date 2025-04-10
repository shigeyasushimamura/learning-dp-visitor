export type Character = {
  name: string;
  hp: number;
  maxHp: number;
  extensions?: Extension[];
  state: "idle" | "attack" | "defend" | "heal";
};

export type Extension = {
  name: string;
  apply: (character: Character) => void;
};

export type Visitor = {
  visitAttack: (attacker: Character, defender: Character) => string;
  visitDefend: (character: Character) => string;
  visitHeal: (character: Character) => string;
};
