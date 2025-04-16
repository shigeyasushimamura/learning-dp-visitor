import { Visitor, Combatant } from "./type";

export class BattleManager {
  constructor(
    public player: Combatant,
    public enemy: Combatant,
    private visitor: Visitor
  ) {}

  act(
    actor: Combatant,
    target: Combatant,
    action: Combatant["state"],
    skillName?: string
  ): string {
    actor.state = action;
    switch (action) {
      case "attack":
        return this.visitor.visitAttack(actor, target);
      case "defend":
        return this.visitor.visitDefend(actor);
      case "useSkill": {
        const skill = actor.getSkills().find((s) => s.name === skillName);
        if (!skill) return `${actor.name}はスキル「${skillName}」を知らない！`;
        return skill.execute(actor, target);
      }
      default:
        return "";
    }
  }

  enemyTurn(): string {
    const actions: Combatant["state"][] = ["attack", "defend"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return this.act(this.enemy, this.player, action);
  }
}
