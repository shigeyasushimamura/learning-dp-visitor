"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockedTurnstileState = exports.LockedTurnstileState = exports.Turnstile = void 0;
var TurnstileStateMachine = /** @class */ (function () {
    function TurnstileStateMachine(owner) {
        this.owner = owner;
    }
    TurnstileStateMachine.prototype.Update = function () {
        var _a;
        (_a = this.crrState) === null || _a === void 0 ? void 0 : _a.Execute(this.owner);
    };
    TurnstileStateMachine.prototype.SetCurrentState = function (state) {
        this.crrState = state;
    };
    TurnstileStateMachine.prototype.ChangeState = function (state) {
        var _a, _b;
        this.preState = this.crrState;
        (_a = this.crrState) === null || _a === void 0 ? void 0 : _a.Exit(this.owner);
        this.SetCurrentState(state);
        (_b = this.crrState) === null || _b === void 0 ? void 0 : _b.Enter(this.owner);
    };
    TurnstileStateMachine.prototype.RevertToPreviousState = function () {
        if (this.preState) {
            this.ChangeState(this.preState);
        }
    };
    return TurnstileStateMachine;
}());
var Turnstile = /** @class */ (function () {
    function Turnstile() {
        this.stateMachine = new TurnstileStateMachine(this);
        this.stateMachine.SetCurrentState(new LockedTurnstileState());
    }
    Turnstile.prototype.Update = function () {
        this.stateMachine.Update();
    };
    Turnstile.prototype.ChangeState = function (state) {
        this.stateMachine.ChangeState(state);
    };
    Turnstile.prototype.unlock = function () {
        console.log("🔓 Turnstile unlocked.");
    };
    Turnstile.prototype.lock = function () {
        console.log("🔒 Turnstile locked.");
    };
    Turnstile.prototype.coin = function () {
        console.log("🪙 Coin inserted.");
        if (this.stateMachine instanceof TurnstileStateMachine) {
            this.stateMachine.ChangeState(new UnlockedTurnstileState());
        }
    };
    Turnstile.prototype.thankyou = function () {
        console.log("🙏 Thank you.");
    };
    Turnstile.prototype.push = function () {
        console.log("🚶 Person pushed.");
        if (this.stateMachine instanceof TurnstileStateMachine) {
            this.stateMachine.ChangeState(new LockedTurnstileState());
        }
    };
    return Turnstile;
}());
exports.Turnstile = Turnstile;
var LockedTurnstileState = /** @class */ (function () {
    function LockedTurnstileState() {
    }
    LockedTurnstileState.prototype.Enter = function (t) {
        t.lock();
    };
    LockedTurnstileState.prototype.Execute = function (t) {
        // 入力をシミュレーション的に処理
        console.log("[Locked State] Waiting for coin...");
    };
    LockedTurnstileState.prototype.Exit = function (t) {
        console.log("Exiting Locked State");
    };
    return LockedTurnstileState;
}());
exports.LockedTurnstileState = LockedTurnstileState;
var UnlockedTurnstileState = /** @class */ (function () {
    function UnlockedTurnstileState() {
    }
    UnlockedTurnstileState.prototype.Enter = function (t) {
        t.unlock();
    };
    UnlockedTurnstileState.prototype.Execute = function (t) {
        console.log("[Unlocked State] Waiting for push...");
    };
    UnlockedTurnstileState.prototype.Exit = function (t) {
        console.log("Exiting Unlocked State");
    };
    return UnlockedTurnstileState;
}());
exports.UnlockedTurnstileState = UnlockedTurnstileState;
var gate = new Turnstile();
gate.Update(); // [Locked] → Waiting for coin
gate.coin(); // → unlock, 状態変化
gate.Update(); // [Unlocked] → Waiting for push
gate.push(); // → lock, 状態変化
gate.Update(); // [Locked] again
