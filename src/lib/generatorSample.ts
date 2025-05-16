export interface Character {
  name: string;
  hp: number;
}

// yield で中断したとき：
// → { value: <yieldした値>, done: false }

// return で終了したとき：
// → { value: <returnした値>, done: true } ← done: true は自動的に設定されます

export function* battle(
  player: Character,
  monster: Character
): Generator<string | undefined, string, unknown> {
  console.log(`A wild ${monster.name} appears!`);

  while (player.hp > 0 && monster.hp > 0) {
    console.log(`Player HP: ${player.hp}, Monster HP: ${monster.hp}`);
    const playerAttack = Math.floor(Math.random() * 10) + 1;
    console.log(`Player Attacks ${monster.name} for ${playerAttack} damage`);
    monster.hp -= playerAttack;

    yield undefined;

    if (monster.hp <= 0) {
      console.log(`${monster.name} is defeated`);
      return "Victory";
    }

    const monsterAttack = Math.floor(Math.random() * 10) + 1;

    console.log(`${monster.name} attacks Player for ${monsterAttack} damage`);
    player.hp -= monsterAttack;
    yield undefined;

    if (player.hp <= 0) {
      console.log(`Player is defeated`);
      return "Defeat";
    }
  }
  return "done";
  //   yield { value: undefined, done: true };
}

// const player: Character = { name: "Hero", hp: 30 };
// const monster: Character = { name: "Goblin", hp: 23 };

// const battleGenerator = battle(player, monster);

// console.log(battleGenerator.next());
// console.log(battleGenerator.next());
// console.log(battleGenerator.next());
// console.log(battleGenerator.next());
