import { ICharacter } from "./Character";
import { ICombatRole } from "./CharacterContext";

export class BattleService {
  static performAction(
    actor: ICharacter,
    target: ICharacter,
    action: ICombatRole["state"],
    skillName?: string
  ): string {
    const role = actor.getContext()?.getRole<ICombatRole>("combat");
    if (!role) return `${actor.name}は戦闘できない！`;

    role.state = action;
    switch (action) {
      case "attack": {
        const damage = Math.floor(Math.random() * 8) + 3;
        target.hp = Math.max(target.hp - damage, 0);
        return `${actor.name}の攻撃！ ${target.name}に${damage}のダメージ！`;
      }
      case "defend": {
        return `${actor.name}は防御の体勢に入った。次のダメージを軽減！`;
      }
      case "useSkill": {
        const skill = role.getSkills().find((s) => s.name === skillName);
        if (!skill) return `${actor.name}はスキル「${skillName}」を知らない！`;
        return skill.execute(actor, target);
      }
      default:
        return "";
    }
  }

  static enemyTurn(player: ICharacter, enemy: ICharacter): string {
    const role = enemy.getContext()?.getRole<ICombatRole>("combat");
    if (!role) return `${enemy.name}は戦闘不能だ！`;
    const actions: ICombatRole["state"][] = ["attack", "defend"];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return this.performAction(enemy, player, action);
  }
}
