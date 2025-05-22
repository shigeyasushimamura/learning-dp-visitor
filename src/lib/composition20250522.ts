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
