interface Modem {
  dial(): void;
  setVolume(): void;
}

class AModem implements Modem {
  dial() {}

  setVolume(): void {}
}

class DecoModem implements Modem {
  constructor(private m: Modem) {}

  dial(): void {
    this.m.setVolume();
    this.m.dial();
  }

  setVolume(): void {}
}

interface Player {
  getAttack(): number;
  getDefense(): number;
}

class BasicPlayer implements Player {
  getAttack(): number {
    return 10;
  }
  getDefense(): number {
    return 5;
  }
}

// abstract decorator
abstract class EquipmentDecorator implements Player {
  constructor(protected player: Player) {}
  abstract getAttack(): number;
  abstract getDefense(): number;
}

class Sword extends EquipmentDecorator {
  getAttack(): number {
    return this.player.getAttack() + 10;
  }

  getDefense(): number {
    return this.player.getDefense();
  }
}

class Armor extends EquipmentDecorator {
  getAttack(): number {
    return this.player.getAttack();
  }

  getDefense(): number {
    return this.player.getDefense() + 10;
  }
}

let hero: Player = new BasicPlayer();
hero = new Sword(hero);

interface Character {
  takeDamage(damage: number): void;
}

interface Spell {
  cast(target: Character): void;
}

class Fireball implements Spell {
  cast(target: Character): void {
    target.takeDamage(10);
  }
}

abstract class SpellDecorator implements Spell {
  constructor(protected decorated: Spell) {}

  cast(target: Character): void {
    this.decorated.cast(target);
  }
}

class Empowered extends SpellDecorator {
  cast(target: Character): void {
    console.log("呪文が強化された！");
    // まず元の呪文を発動
    this.decorated.cast(target);
    // 追加ダメージ
    target.takeDamage(10);
  }
}

class ManaEfficient extends SpellDecorator {
  cast(target: Character): void {
    console.log("マナ消費が半分になった！");
    // ここでは元のcastを呼ぶだけでOK
    this.decorated.cast(target);
  }
}
class QuickCooldown extends SpellDecorator {
  cast(target: Character): void {
    this.decorated.cast(target);
    console.log("クールダウンが短くなった！");
  }
}

class Enemy implements Character {
  takeDamage(damage: number): void {}
}

const enemy = new Enemy();

// キャラは name, takeDamage を持っているものとします
let spell: Spell = new Fireball();

// 呪文に強化とクールダウン短縮を重ねる
spell = new Empowered(spell);
spell = new QuickCooldown(spell);

// 発動するとログも副作用も含めて順番に処理される
spell.cast(enemy);
/*
  呪文が強化された！
  Goblin に火の玉をぶつけた！
  Goblin に10の追加ダメージ！
  クールダウンが短くなった！
*/
