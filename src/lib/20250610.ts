interface State<T> {
  Enter(context: T): void;
  Execute(context: T): void;
  Exit(context: T): void;
}

interface IStateMachine<T> {
  Update(): void;
  SetCurrentState(state: State<T>): void;
  ChangeState(state: State<T>): void;
  RevertToPreviousState(): void;
}

class TurnstileStateMachine implements IStateMachine<Turnstile> {
  private preState?: State<Turnstile>;
  private crrState?: State<Turnstile>;

  constructor(private owner: Turnstile) {}

  Update(): void {
    this.crrState?.Execute(this.owner);
  }

  SetCurrentState(state: State<Turnstile>): void {
    this.crrState = state;
  }

  ChangeState(state: State<Turnstile>): void {
    this.preState = this.crrState;
    this.crrState?.Exit(this.owner);
    this.SetCurrentState(state);
    this.crrState?.Enter(this.owner);
  }

  RevertToPreviousState(): void {
    if (this.preState) {
      this.ChangeState(this.preState);
    }
  }
}

export class Turnstile {
  private stateMachine: IStateMachine<Turnstile>;

  constructor() {
    this.stateMachine = new TurnstileStateMachine(this);
    this.stateMachine.SetCurrentState(new LockedTurnstileState());
  }

  Update() {
    this.stateMachine.Update();
  }

  ChangeState(state: State<Turnstile>) {
    this.stateMachine.ChangeState(state);
  }

  unlock() {
    console.log("🔓 Turnstile unlocked.");
  }

  lock() {
    console.log("🔒 Turnstile locked.");
  }

  coin() {
    console.log("🪙 Coin inserted.");
    if (this.stateMachine instanceof TurnstileStateMachine) {
      this.stateMachine.ChangeState(new UnlockedTurnstileState());
    }
  }

  thankyou() {
    console.log("🙏 Thank you.");
  }

  push() {
    console.log("🚶 Person pushed.");
    if (this.stateMachine instanceof TurnstileStateMachine) {
      this.stateMachine.ChangeState(new LockedTurnstileState());
    }
  }
}

export class LockedTurnstileState implements State<Turnstile> {
  Enter(t: Turnstile): void {
    t.lock();
  }

  Execute(t: Turnstile): void {
    // 入力をシミュレーション的に処理
    console.log("[Locked State] Waiting for coin...");
  }

  Exit(t: Turnstile): void {
    console.log("Exiting Locked State");
  }
}

export class UnlockedTurnstileState implements State<Turnstile> {
  Enter(t: Turnstile): void {
    t.unlock();
  }

  Execute(t: Turnstile): void {
    console.log("[Unlocked State] Waiting for push...");
  }

  Exit(t: Turnstile): void {
    console.log("Exiting Unlocked State");
  }
}

const gate = new Turnstile();

gate.Update(); // [Locked] → Waiting for coin
gate.coin(); // → unlock, 状態変化
gate.Update(); // [Unlocked] → Waiting for push
gate.push(); // → lock, 状態変化
gate.Update(); // [Locked] again
