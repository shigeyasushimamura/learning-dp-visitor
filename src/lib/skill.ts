import { ISkill } from "./Character";
import { ICombatRole } from "./characterContext";

export const healingSkill: ISkill = {
  name: "ヒール",
  execute: (user, _target) => {
    const role = user.getContext()?.getRole<ICombatRole>("combat");
    if (!role) return `${user.name}はヒールを使えない！`;
    const heal = Math.floor(Math.random() * 5) + 5;
    user.hp = Math.min(user.hp + heal, user.maxHp);
    return `${user.name}は回復した！ HPが${heal}回復！`;
  },
};
