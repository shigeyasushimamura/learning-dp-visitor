import { Character, Visitor } from "./type";
export class BattleManager {
  constructor(
    public player: Character,
    public enemy: Character,
    private visitor: Visitor
  ) {}

  act(action: Character["state"]): string {
    switch (action) {
      case "attack":
        return this.visitor.visitAttack(this.player, this.enemy);
      case "defend":
        return this.visitor.visitDefend(this.player);
      case "heal":
        return this.visitor.visitHeal(this.player);
      default:
        return "";
    }
  }

  // ここに敵のAIや行動ロジックを追加していける
  enemyTurn(): string {
    const actions: Character["state"][] = ["attack", "defend"];
    const action = actions[Math.floor(Math.random() * actions.length)];
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
