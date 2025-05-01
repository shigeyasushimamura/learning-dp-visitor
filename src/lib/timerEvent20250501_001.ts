type TimerEventDTO = {
  targetId: string;
  eventType: "timeout";
  payload?: any;
};

interface TimedEventHandler {
  id: string;
  handle(event: TimerEventDTO): void;
}

class TimerSystem {
  private handlers = new Map<string, TimedEventHandler>();

  register(handler: TimedEventHandler) {
    this.handlers.set(handler.id, handler);
  }

  /** 指定 tick 後にイベント発火 */
  schedule(delayMs: number, targetId: string, payload?: unknown) {
    setTimeout(() => {
      const h = this.handlers.get(targetId);
      if (h) {
        h.handle({ targetId, eventType: "timeout", payload });
      } else {
        console.warn(`handler <${targetId}> not found`);
      }
    }, delayMs);
  }
}

interface IDoor {
  open(): void;
  close(): void;
}

export class TimedDoor implements IDoor, TimedEventHandler {
  constructor(public id: string) {}
  private isOpen = true;
  open(): void {}
  close(): void {
    this.isOpen = true;
  }
  handle(event: TimerEventDTO): void {
    if (event.eventType === "timeout") {
      this.open();
      console.log("door locked");
    }
  }
}

const timer = new TimerSystem();

const doorA = new TimedDoor("doorA");
const doorB = new TimedDoor("doorB");

timer.register(doorA);
timer.register(doorB);

timer.schedule(3000, "doorA");
timer.schedule(4000, "doorB");
