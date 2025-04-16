import { describe, it, expect, vi } from "vitest";
import { BattleManager } from "./BattleManager";
import { Visitor, ISkill, Character } from "./Character";
import { CharacterContext, CombatCharacterModule } from "./characterContext";

const INITIAL_PLAYER_HP = 40;
const INITIAL_ENEMY_HP = 30;
const MOCK_ATTACK_DAMAGE = 5;
const HEAL_AMOUNT = 10;
const SKILL_NAME_HEAL = "ヒール";
const SKILL_NAME_UNKNOWN = "ファイア";

const TestHealingSkill: ISkill = {
  name: SKILL_NAME_HEAL,
  execute: (user) => {
    user.hp = Math.min(user.hp + HEAL_AMOUNT, user.maxHp);
    return `${user.name}はHPを${HEAL_AMOUNT}回復した`;
  },
};

const createTestPlayer = (): Character => {
  const player = new Character(
    "テスト勇者",
    INITIAL_PLAYER_HP,
    INITIAL_PLAYER_HP
  );
  const ctx = new CharacterContext();
  ctx.addRole("combat", new CombatCharacterModule([], [TestHealingSkill]));
  player.setContext(ctx);
  return player;
};

const createTestEnemy = (): Character => {
  const enemy = new Character(
    "テストスライム",
    INITIAL_ENEMY_HP,
    INITIAL_ENEMY_HP
  );
  const ctx = new CharacterContext();
  ctx.addRole("combat", new CombatCharacterModule());
  enemy.setContext(ctx);
  return enemy;
};

const MockVisitor: Visitor = {
  visitAttack: (a, d) => {
    const damage = MOCK_ATTACK_DAMAGE;
    d.hp = Math.max(0, d.hp - damage);
    return `${a.name}が${d.name}に${damage}のダメージを与えた！`;
  },
  visitDefend: (c) => `${c.name}は防御の体勢に入った。`,
};

describe("BattleManager", () => {
  it("攻撃で敵HPが減少する", () => {
    const manager = new BattleManager(
      createTestPlayer(),
      createTestEnemy(),
      MockVisitor
    );
    manager.act(manager.player, manager.enemy, "attack");

    expect(manager.enemy.hp).toBe(INITIAL_ENEMY_HP - MOCK_ATTACK_DAMAGE);
    const playerCombat = manager.player
      .getContext()
      ?.getRole<ICombatRole>("combat");
    expect(playerCombat?.state).toBe("attack");
  });

  it("スキル『ヒール』でHPが回復する", () => {
    const player = createTestPlayer();
    player.hp = INITIAL_PLAYER_HP - HEAL_AMOUNT;
    const manager = new BattleManager(player, createTestEnemy(), MockVisitor);

    manager.act(manager.player, manager.enemy, "useSkill", SKILL_NAME_HEAL);
    expect(manager.player.hp).toBe(INITIAL_PLAYER_HP);
  });

  it("未定義スキル使用時はHPが変化しない", () => {
    const player = createTestPlayer();
    const manager = new BattleManager(player, createTestEnemy(), MockVisitor);

    const beforeHp = player.hp;
    manager.act(player, manager.enemy, "useSkill", SKILL_NAME_UNKNOWN);
    expect(player.hp).toBe(beforeHp);
  });

  it("防御を選択すると状態が'defend'になる", () => {
    const manager = new BattleManager(
      createTestPlayer(),
      createTestEnemy(),
      MockVisitor
    );
    manager.act(manager.player, manager.enemy, "defend");
    const playerCombat = manager.player
      .getContext()
      ?.getRole<ICombatRole>("combat");
    expect(playerCombat?.state).toBe("defend");
  });

  describe("enemyTurn()", () => {
    it("乱数が0のとき攻撃を選択し、プレイヤーHPが減少する", () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const manager = new BattleManager(
        createTestPlayer(),
        createTestEnemy(),
        MockVisitor
      );
      manager.enemyTurn();

      const enemyCombat = manager.enemy
        .getContext()
        ?.getRole<ICombatRole>("combat");
      expect(enemyCombat?.state).toBe("attack");
      expect(manager.player.hp).toBe(INITIAL_PLAYER_HP - MOCK_ATTACK_DAMAGE);

      vi.restoreAllMocks();
    });

    it("乱数が0.99のとき防御を選択し、プレイヤーHPは変化しない", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.99);
      const manager = new BattleManager(
        createTestPlayer(),
        createTestEnemy(),
        MockVisitor
      );
      const beforeHp = manager.player.hp;
      manager.enemyTurn();

      const enemyCombat = manager.enemy
        .getContext()
        ?.getRole<ICombatRole>("combat");
      expect(enemyCombat?.state).toBe("defend");
      expect(manager.player.hp).toBe(beforeHp);

      vi.restoreAllMocks();
    });
  });
});
