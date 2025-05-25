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
