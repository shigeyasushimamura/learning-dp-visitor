interface Command {
  execute(): number;
  undo(): void;
}

class Player {
  private x = 0;
  private y = 0;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    console.log(`Moved to (${this.x}, ${this.y})`);
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}

class MoveCommand implements Command {
  private prevX = 0;
  private prevY = 0;

  constructor(private player: Player, private dx: number, private dy: number) {}

  execute(): void {
    const { x, y } = this.player.getPosition();
    this.prevX = x;
    this.prevY = y;

    this.player.setPosition(x + this.dx, y + this.dy);
    console.log("execute!");
    console.log(`Player:`, this.player.getPosition());
  }

  undo(): void {
    this.player.setPosition(this.prevX, this.prevY);
    console.log("undo!");
    console.log(`Player:`, this.player.getPosition());
  }
}

class CommandManager {
  private history: Command[] = [];

  executeCommand(cmd: Command) {
    cmd.execute();
    this.history.push(cmd);
  }

  undo() {
    const commnad = this.history.pop();
    if (commnad) {
      commnad.undo();
    }
  }

  undoAll() {
    while (this.history.length > 0) {
      this.undo();
    }
  }
}

const player = new Player();
const manager = new CommandManager();

manager.executeCommand(new MoveCommand(player, 1, 0)); // → (1,0)
manager.executeCommand(new MoveCommand(player, 0, 2)); // ↓ (1,2)
manager.executeCommand(new MoveCommand(player, -1, -1)); // ←↑ (0,1)

manager.undo(); // (1,2)
manager.undo(); // (1,0)
manager.undo(); // (0,0)
