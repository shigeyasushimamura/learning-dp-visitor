interface DotCommand {
  execute(): void;
  undo(): void;
}

class Dot {
  constructor(public x: number, public y: number) {}
}

class DotMemory {
  static id: number = 100;
  static listMap: Map<number, Dot> = new Map();

  static add(dot: Dot) {
    DotMemory.listMap.set(DotMemory.id++, dot);
  }

  static get(id: number) {
    return DotMemory.listMap.get(id);
  }

  static delete(id: number) {
    DotMemory.listMap.delete(id);
  }
}

class DrawDot implements DotCommand {
  public drawedId: number | undefined = undefined;

  execute() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    DotMemory.add(new Dot(x, y));
    this.drawedId = DotMemory.id;
  }
  undo() {
    if (this.drawedId) {
      DotMemory.delete(this.drawedId);
    }
  }
}

class DotManager {
  list: Array<DotCommand> = [];

  executeCommand(command: DotCommand) {
    command.execute();
    this.list.push(command);
  }
  undoLast() {
    const last = this.list.pop();
    if (last) {
      last.undo();
    }
  }
}
