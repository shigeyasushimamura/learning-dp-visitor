class CombatManager {
  private observers: CombatObserver[] = [];

  addObserver(observer: CombatObserver) {
    this.observers.push(observer);
  }
  private notifyObservers() {
    for (const o of this.observers) {
      o.onCombatUpdated(this);
    }
  }
}

interface CombatObserver {
  onCombatUpdated(subject: CombatManager): void;
}
