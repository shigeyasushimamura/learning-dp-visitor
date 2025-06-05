// === Interface ===
interface Command {
  execute(): CommandResult;
  undo(): void;
}

interface CommandResult {
  commandId: number;
  action: string;
  effect: any;
}

// === Soldier ===
class Soldier {
  private health = 100;
  private position = 0;

  move(d: number) {
    this.position += d;
    return this.position;
  }

  moveBack(d: number) {
    this.position -= d;
  }

  attack(): number {
    this.health -= 10;
    return 10;
  }

  heal(d: number) {
    this.health += d;
  }

  getStatus() {
    return { position: this.position, health: this.health };
  }
}

// === Command Implementations ===
let commandCounter = 0;

class MoveCommand implements Command {
  private id = ++commandCounter;
  constructor(private soldier: Soldier, private dist: number) {}

  execute(): CommandResult {
    const newPos = this.soldier.move(this.dist);
    return {
      commandId: this.id,
      action: "move",
      effect: { dist: this.dist, newPos },
    };
  }

  undo() {
    this.soldier.moveBack(this.dist);
  }
}

class AttackCommand implements Command {
  private id = ++commandCounter;
  private damage = 0;
  constructor(private soldier: Soldier) {}

  execute(): CommandResult {
    this.damage = this.soldier.attack();
    return {
      commandId: this.id,
      action: "attack",
      effect: { damage: this.damage },
    };
  }

  undo() {
    this.soldier.heal(this.damage);
  }
}

// === CommandHandler (管理のみ) ===
class CommandHandler {
  private history: Command[] = [];

  execute(cmd: Command): CommandResult {
    const result = cmd.execute();
    this.history.push(cmd);
    return result;
  }

  undo() {
    const cmd = this.history.pop();
    if (cmd) cmd.undo();
  }
}

// === Commander (命令だけ) ===
class Commander {
  constructor(private soldier: Soldier, private handler: CommandHandler) {}

  move(dist: number) {
    const result = this.handler.execute(new MoveCommand(this.soldier, dist));
    console.log("[Commander] move:", result);
  }

  attack() {
    const result = this.handler.execute(new AttackCommand(this.soldier));
    console.log("[Commander] attack:", result);
  }

  undo() {
    this.handler.undo();
  }
}

// === 利用例 ===
const soldier = new Soldier();
const handler = new CommandHandler();
const commander = new Commander(soldier, handler);

commander.move(5);
commander.attack();
commander.move(-2);

commander.undo();
commander.undo();

console.log("Soldier status:", soldier.getStatus());
