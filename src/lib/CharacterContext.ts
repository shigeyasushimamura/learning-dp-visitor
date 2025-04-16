import { ICombatStatusEffect, ISkill } from "./Character";
export interface Role {}

export class CharacterContext {
  private roles: Map<string, Role> = new Map();

  addRole(key: string, role: Role): void {
    this.roles.set(key, role);
  }

  getRole<T extends Role>(key: string): T | undefined {
    return this.roles.get(key) as T | undefined;
  }
}

export interface ICombatRole extends Role {
  state: "idle" | "attack" | "defend" | "useSkill";
  getStatusEffects(): ICombatStatusEffect[];
  addStatusEffect(effect: ICombatStatusEffect): void;
  getSkills(): ISkill[];
  addSkill(skill: ISkill): void;
}

export class CombatCharacterModule implements ICombatRole {
  public state: ICombatRole["state"] = "idle";
  private statusEffects: ICombatStatusEffect[] = [];
  private skills: ISkill[] = [];

  constructor(effects: ICombatStatusEffect[] = [], skills: ISkill[] = []) {
    this.statusEffects = effects;
    this.skills = skills;
  }

  getStatusEffects(): ICombatStatusEffect[] {
    return this.statusEffects;
  }

  addStatusEffect(effect: ICombatStatusEffect): void {
    this.statusEffects.push(effect);
  }

  getSkills(): ISkill[] {
    return this.skills;
  }

  addSkill(skill: ISkill): void {
    this.skills.push(skill);
  }
}
