import { describe, it, expect, vi, afterEach } from "vitest";
import { battle, Character, BattleResult } from "./generatorSample";

describe("battle generator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return Victory when the monster is defeated first", () => {
    const player: Character = { name: "Hero", hp: 20 };
    const monster: Character = { name: "Goblin", hp: 5 };

    // プレイヤー攻撃：5 (Goblinに勝つ), モンスター攻撃：未到達
    vi.spyOn(Math, "random").mockReturnValueOnce(0.4); // 0.4 * 10 + 1 = 5

    const gen = battle(player, monster);

    let result = gen.next(); // プレイヤー攻撃
    expect(result.done).toBe(false);

    result = gen.next(); // モンスターのHPが0以下でVictory
    // console.log("result:", result);
    expect(result.done).toBe(true);
    expect(result.value).toBe("Victory");
  });

  it("should return Defeat when the player is defeated first", () => {
    const player: Character = { name: "Hero", hp: 5 };
    const monster: Character = { name: "Goblin", hp: 20 };

    // プレイヤー攻撃：3, モンスター攻撃：6 (Heroに勝つ)
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.2) // player attack: 3
      .mockReturnValueOnce(0.5); // monster attack: 6

    const gen = battle(player, monster);

    let result = gen.next(); // プレイヤー攻撃
    expect(result.done).toBe(false);

    result = gen.next(); // モンスター反撃
    expect(result.done).toBe(false);

    result = gen.next(); // プレイヤーのHPが0以下でDefeat

    expect(result.done).toBe(true);
    expect(result.value).toBe("Defeat");
  });
});
