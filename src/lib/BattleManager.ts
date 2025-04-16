import { Character, Visitor } from "./type";

export class BattleManager {
  constructor(
    public player: Character,
    public enemy: Character,
    private visitor: Visitor
  ) {}

  act(
    actor: Character,
    target: Character,
    action: Character["state"],
    skillName?: string
  ): string {
    actor.state = action;
    switch (action) {
      case "attack":
        return this.visitor.visitAttack(actor, target);
      case "defend":
        return this.visitor.visitDefend(actor);
      case "useSkill": {
        const skill = actor.skills?.find((s) => s.name === skillName);
        if (!skill) return `${actor.name}はスキル「${skillName}」を知らない！`;
        return skill.execute(actor, target);
      }
      default:
        return "";
    }
  }

  enemyTurn(): string {
    const actions: Character["state"][] = ["attack", "defend"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return this.act(this.enemy, this.player, action);
  }
}
