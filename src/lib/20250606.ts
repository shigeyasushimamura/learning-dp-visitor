export interface ActiveCommand {
  execute(): void;
}

export class ActiveObjectEngine {
  private list: Array<ActiveCommand> = [];

  addCommand(c: ActiveCommand) {
    this.list.push(c);
  }

  run() {
    while (this.list) {
      const cmd = this.list.shift();
      cmd?.execute();
    }
  }
}

export class SleepCommand implements ActiveCommand {
  private engine: ActiveObjectEngine | undefined;
  private sleepTime = 0;
  private startTime = 0;
  private started = false;

  constructor(
    milliseconds: number,
    e: ActiveObjectEngine,
    private wakuupCommand: ActiveCommand
  ) {
    this.sleepTime = milliseconds;
    this.engine = e;
  }

  execute(): void {
    const currentTime = Date.now();
    if (!this.started) {
      this.started = true;
      this.startTime = currentTime;
      this.engine?.addCommand(this);
    } else if (currentTime - this.startTime < this.sleepTime) {
      this.engine?.addCommand(this);
    } else {
      this.engine?.addCommand(this.wakuupCommand);
    }
  }
}

export class DelayedTyper implements ActiveCommand {
  static stop: boolean = false;
  static engine: ActiveObjectEngine = new ActiveObjectEngine();
  constructor(private itsDelay: number, private itsChar: string) {}

  execute(): void {
    console.log("its char:", this.itsChar);
    if (!DelayedTyper.stop) {
      this.delayAndRepeat();
    }
  }

  delayAndRepeat() {
    DelayedTyper.engine.addCommand(
      new SleepCommand(this.itsDelay, DelayedTyper.engine, this)
    );
  }
}

class DelayedTyperStopCommand implements ActiveCommand {
  execute(): void {
    DelayedTyper.stop = true;
  }
}
