import { ICharacterContext } from "./CharacterContext";
export interface ICharacter {
  name: string;
  hp: number;
  maxHp: number;
  getContext(): ICharacterContext | undefined;
  setContext(context: ICharacterContext): void;
}

export interface Visitor {
  visitAttack(attacker: ICharacter, defender: ICharacter): string;
  visitDefend(character: ICharacter): string;
}

export class Character implements Character {
  constructor(
    public name: string,
    public hp: number,
    public maxHp: number,
    private context?: ICharacterContext
  ) {}

  getContext(): ICharacterContext | undefined {
    return this.context;
  }

  setContext(context: ICharacterContext): void {
    this.context = context;
  }
}

export interface ISkill {
  name: string;
  execute(user: Character, target?: Character): string;
}

export interface ICombatStatusEffect {
  name: string;
  modifyDamage?: (base: number) => number;
  onReceive?: (character: Character) => void;
}
