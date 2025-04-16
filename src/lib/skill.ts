import { Skill } from "./type";

export const healingSkill: Skill = {
  name: "ヒール",
  execute: (user) => {
    const heal = Math.floor(Math.random() * 5) + 5;
    user.hp = Math.min(user.hp + heal, user.maxHp);
    return `${user.name}は回復した！ HPが${heal}回復！`;
  },
};
