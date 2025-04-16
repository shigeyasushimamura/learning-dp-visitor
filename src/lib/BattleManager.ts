import { Character, Visitor } from "./type";

export class BattleManager {
  constructor(
    public player: Character,
    public enemy: Character,
    private visitor: Visitor
  ) {}

  act(action: Character["state"], skillName?: string): string {
    this.player.state = action;
    switch (action) {
      case "attack":
        return this.visitor.visitAttack(this.player, this.enemy);
      case "defend":
        return this.visitor.visitDefend(this.player);
      case "useSkill": {
        const skill = this.player.skills.find((s) => s.name === skillName);
        if (!skill)
          return `${this.player.name}はスキル「${skillName}」を知らない！`;
        return skill.execute(this.player, this.enemy);
      }
      default:
        return "";
    }
  }

  enemyTurn(): string {
    const actions: Character["state"][] = ["attack", "defend"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    this.enemy.state = action;
    switch (action) {
      case "attack":
        return this.visitor.visitAttack(this.enemy, this.player);
      case "defend":
        return this.visitor.visitDefend(this.enemy);
      default:
        return "";
    }
  }
}
