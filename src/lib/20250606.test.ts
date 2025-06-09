import { describe, it, expect, vi, afterEach } from "vitest";
import { ActiveCommand, ActiveObjectEngine, SleepCommand } from "./20250606";

let commandExecuted = false;
class Wakeup implements ActiveCommand {
  execute(): void {
    commandExecuted = true;
  }
}

describe("test activeObjectEngine", () => {
  beforeEach(() => {
    commandExecuted = false;
  });

  it("testSleepCommand", () => {
    const wakeup = new Wakeup();
    const e = new ActiveObjectEngine();

    const c = new SleepCommand(1000, e, wakeup);
    e.addCommand(c);

    e.run();
  });
});
