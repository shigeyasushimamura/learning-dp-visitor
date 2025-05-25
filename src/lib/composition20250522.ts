interface StatusEffect {
  modifyDamage?(damage: number): number;
}

class PoisonEffect implements StatusEffect {
  modifyDamage(damage: number): number {
    return damage + 2;
  }
}

class Character {
  private statusEffects: StatusEffect[] = [];

  constructor(public name: string, public hp: number) {}

  takeDamage(baseDamage: number) {
    let modified = baseDamage;
    for (const effect of this.statusEffects) {
      // ?.はオプショナルチェーン。関数が存在する場合.以下の()を引数として関数に渡す
      modified = effect.modifyDamage?.(modified) ?? modified;
    }
    this.hp -= modified;
    console.log(`${this.name} took ${modified} damage`);
  }

  addStatusEffect(effect: StatusEffect) {
    this.statusEffects.push(effect);
  }
}

// 以下decoratorのサンプル
// IFの分離を使えば、上手く特定分野のdecoratorを実装できる。
// 例えばPlayerに戦闘用や、会話用のIFを結合して持たせることが出来れば、それぞれに対してdecoratorができるし、
// 戦闘用のdecoratorが他の分野を侵害する危険性がない
interface CombatStats {
  getAttack(): number;
  getDefense(): number;
}

interface CharacterInfo {
  getName(): string;
}

interface Player extends CombatStats, CharacterInfo {}

abstract class StatModifierDecorator implements CombatStats {
  constructor(protected base: CombatStats) {}

  getAttack(): number {
    return this.base.getAttack();
  }

  getDefense(): number {
    return this.base.getDefense();
  }
}

class SwordItem extends StatModifierDecorator {
  override getAttack(): number {
    return super.getAttack() + 5;
  }
}

class ArmorItem extends StatModifierDecorator {
  override getDefense(): number {
    return super.getDefense() + 10;
  }
}

class AmuletItem extends StatModifierDecorator {
  override getAttack(): number {
    return super.getAttack() + 2;
  }

  override getDefense(): number {
    return super.getDefense() + 3;
  }
}

class BasicPlayer2 implements Player {
  constructor(
    private name: string,
    private attack: number,
    private defense: number
  ) {}
  getName(): string {
    return this.name;
  }
  getAttack(): number {
    return this.attack;
  }

  getDefense(): number {
    return this.defense;
  }
}

// プレイヤーを生成
const basePlayer = new BasicPlayer2("Hero", 10, 5);

// 戦闘ステータスだけをデコレート（装備）
const withSword = new SwordItem(basePlayer); // CombatStatsとして扱う

// 出力してみる
console.log("Name:", basePlayer.getName()); // ← CharacterInfoはbasePlayerで扱う
console.log("Attack:", withSword.getAttack()); // 10 + 5 = 15
console.log("Defense:", withSword.getDefense()); // 5（変化なし）

const withSwordAndArmor = new ArmorItem(new SwordItem(basePlayer));
const fullEquipped = new AmuletItem(withSwordAndArmor);

console.log("Name:", basePlayer.getName()); // Hero
console.log("Attack:", fullEquipped.getAttack()); // 10 + 5 + 2 = 17
console.log("Defense:", fullEquipped.getDefense()); // 5 + 10 + 3 = 18
