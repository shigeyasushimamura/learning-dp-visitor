import { describe, it, expect, vi } from "vitest";
import { BattleManager } from "./BattleManager";
import { Character, Visitor, Skill } from "./type";

// ------------------- テスト定数 -------------------
const INITIAL_PLAYER_HP = 40;
const INITIAL_ENEMY_HP = 30;
const MOCK_ATTACK_DAMAGE = 5;
const HEAL_AMOUNT = 10;
const SKILL_NAME_HEAL = "ヒール";
const SKILL_NAME_UNKNOWN = "ファイア";

// ------------------- モックスキル -------------------
const TestHealingSkill: Skill = {
  name: SKILL_NAME_HEAL,
  execute: (user) => {
    user.hp = Math.min(user.hp + HEAL_AMOUNT, user.maxHp);
    return `${user.name}はHPを${HEAL_AMOUNT}回復した`;
  },
};

// ------------------- キャラクター生成 -------------------
const createTestPlayer = (): Character => ({
  name: "テスト勇者",
  hp: INITIAL_PLAYER_HP,
  maxHp: INITIAL_PLAYER_HP,
  extensions: [],
  skills: [TestHealingSkill],
  state: "idle",
});

const createTestEnemy = (): Character => ({
  name: "テストスライム",
  hp: INITIAL_ENEMY_HP,
  maxHp: INITIAL_ENEMY_HP,
  extensions: [],
  skills: [],
  state: "idle",
});

// ------------------- モックVisitor -------------------
const MockVisitor: Visitor = {
  visitAttack: (a, d) => {
    d.hp -= MOCK_ATTACK_DAMAGE;
    return `${a.name}が${d.name}を攻撃！`;
  },
  visitDefend: (c) => `${c.name}は防御の体勢に入った。`,
};

// ------------------- テスト -------------------
describe("BattleManager", () => {
  it("攻撃で敵HPが減少する", () => {
    const manager = new BattleManager(
      createTestPlayer(),
      createTestEnemy(),
      MockVisitor
    );
    const result = manager.act(manager.player, manager.enemy, "attack");

    expect(manager.enemy.hp).toBe(INITIAL_ENEMY_HP - MOCK_ATTACK_DAMAGE);
    expect(manager.player.state).toBe("attack");
    expect(result).toContain("攻撃");
  });

  it("スキル『ヒール』でHPが回復する", () => {
    const player = createTestPlayer();
    player.hp = INITIAL_PLAYER_HP - HEAL_AMOUNT;
    const manager = new BattleManager(player, createTestEnemy(), MockVisitor);

    const result = manager.act(
      manager.player,
      manager.enemy,
      "useSkill",
      SKILL_NAME_HEAL
    );
    expect(manager.player.hp).toBe(INITIAL_PLAYER_HP);
    expect(result).toContain("回復");
  });

  it("未定義スキル使用時はエラーメッセージを返す", () => {
    const manager = new BattleManager(
      createTestPlayer(),
      createTestEnemy(),
      MockVisitor
    );
    const result = manager.act(
      manager.player,
      manager.enemy,
      "useSkill",
      SKILL_NAME_UNKNOWN
    );
    expect(result).toContain("知らない");
  });

  it("防御を選択すると状態が'defend'になる", () => {
    const manager = new BattleManager(
      createTestPlayer(),
      createTestEnemy(),
      MockVisitor
    );
    manager.act(manager.player, manager.enemy, "defend");
    expect(manager.player.state).toBe("defend");
  });

  describe("enemyTurn()", () => {
    it("乱数が0のとき攻撃を選択する", () => {
      vi.spyOn(Math, "random").mockReturnValue(0); // actions[0] = "attack"
      const manager = new BattleManager(
        createTestPlayer(),
        createTestEnemy(),
        MockVisitor
      );
      const result = manager.enemyTurn();

      expect(manager.enemy.state).toBe("attack");
      expect(manager.player.hp).toBe(INITIAL_PLAYER_HP - MOCK_ATTACK_DAMAGE);
      expect(result).toContain("攻撃");

      vi.restoreAllMocks();
    });

    it("乱数が0.99のとき防御を選択する", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.99); // actions[1] = "defend"
      const manager = new BattleManager(
        createTestPlayer(),
        createTestEnemy(),
        MockVisitor
      );
      const result = manager.enemyTurn();

      expect(manager.enemy.state).toBe("defend");
      expect(manager.player.hp).toBe(INITIAL_PLAYER_HP); // 攻撃されていない
      expect(result).toContain("防御");

      vi.restoreAllMocks();
    });
  });
});
