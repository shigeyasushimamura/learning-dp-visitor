export interface CharacterStatus {}

interface DamageStrategy {
  apply(
    baseDamage: number,
    attacker: CharacterStatus,
    defender: CharacterStatus
  ): number;
}

class PersonalityStrategy implements DamageStrategy {
  apply(damage: number, attacker: CharacterStatus): number {
    switch (attacker.personality) {
      case "aggressive":
        return damage * 1.2;
      case "calm":
        return damage * 0.9;
      default:
        return damage;
    }
  }
}

class WeatherStrategy implements DamageStrategy {
  apply(damage: number, attacker: CharacterStatus): number {
    if (attacker.element === "fire" && attacker.weather === "rainy")
      return damage * 0.7;
    return damage;
  }
}

class ElementStrategy implements DamageStrategy {
  apply(
    damage: number,
    attacker: CharacterStatus,
    defender: CharacterStatus
  ): number {
    if (attacker.element === "fire" && defender.element === "grass")
      return damage * 2;
    if (attacker.element === "water" && defender.element === "fire")
      return damage * 2;
    return damage;
  }
}

class BattleVisitor {
  private strategies: DamageStrategy[] = [
    new PersonalityStrategy(),
    new WeatherStrategy(),
    new ElementStrategy(),
  ];

  calculateDamage(
    attacker: CharacterStatus,
    defender: CharacterStatus
  ): number {
    let damage = attacker.baseAttack;
    for (const strategy of this.strategies) {
      damage = strategy.apply(damage, attacker, defender);
    }
    return Math.floor(damage);
  }
}
