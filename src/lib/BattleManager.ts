import { ICharacter, Visitor } from "./Character";
import { ICombatRole } from "./characterContext";

export class BattleManager {
  constructor(
    public player: ICharacter,
    public enemy: ICharacter,
    private visitor: Visitor
  ) {}

  act(
    actor: ICharacter,
    target: ICharacter,
    action: ICombatRole["state"],
    skillName?: string
  ): string {
    const role = actor.getContext()?.getRole<ICombatRole>("combat");
    if (!role) return `${actor.name}は戦闘できない！`;

    role.state = action;
    switch (action) {
      case "attack":
        return this.visitor.visitAttack(actor, target);
      case "defend":
        return this.visitor.visitDefend(actor);
      case "useSkill": {
        const skill = role.getSkills().find((s) => s.name === skillName);
        if (!skill) return `${actor.name}はスキル「${skillName}」を知らない！`;
        return skill.execute(actor, target);
      }
      default:
        return "";
    }
  }

  enemyTurn(): string {
    const role = this.enemy.getContext()?.getRole<ICombatRole>("combat");
    if (!role) return `${this.enemy.name}は戦闘不能だ！`;
    const actions: ICombatRole["state"][] = ["attack", "defend"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return this.act(this.enemy, this.player, action);
  }
}
