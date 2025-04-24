export type Position = { x: number; y: number };
export interface GameEvent {
  type: string;
  payload: any;
}

export interface GameContext {
  getEntity(id: string): IEntity | undefined;
  getEntitiesInRadius(pos: Position, r: number): IEntity[];
  getEnvironment(): { timeOfDay: string; isRaining: boolean };
}

export type TaskState = "idle" | "running" | "paused" | "done" | "canceled";

// 状態ありタスク
export interface StatefulTask {
  state: TaskState;
  tick(dt: number): Promise<void> | void;
  isBlocking(): boolean;
}

// 状態ありタスクの実装例
export class CastFireball implements StatefulTask {
  state: TaskState = "idle";
  private t = 0;
  constructor(private castTime = 2, private cool = 1) {}
  isBlocking(): boolean {
    return true;
  }
  tick(dt: number): Promise<void> | void {
    if (this.state === "idle") {
      this.state = "running";
    }
    if (this.state === "running") {
      this.t += dt;
      if (this.t >= this.castTime) {
        console.log("🔥Fireball!");
        this.state = "paused";
        this.t = 0;
      }
    } else if (this.state === "paused") {
      this.t += dt;
      if (this.t >= this.cool) this.state = "done";
    }
  }
}

// 簡易タスク
export interface Task {
  execute(): Promise<void> | void;
  isBlocking(): boolean;
}

export class SyncTask implements Task {
  constructor(private act: () => void) {}
  execute(): Promise<void> | void {
    this.act();
  }
  isBlocking(): boolean {
    return true;
  }
}

export class AsyncTask implements Task {
  constructor(private act: () => Promise<void>) {}
  async execute() {
    await this.act();
  }
  isBlocking(): boolean {
    return false;
  }
}

export class TaskQueue {
  private q: Task[] = [];
  push(t: Task) {
    this.q.push(t);
  }
  async tick() {
    if (!this.q.length) return;
    const cur = this.q[0];
    await cur.execute();
    if (!cur.isBlocking) this.q.shift();
  }
}

// 状態ありタスク用のスケジューラ
export class TaskScheduler {
  private q: StatefulTask[] = [];
  push(t: StatefulTask) {
    this.q.push(t);
  }

  async update(dt: number) {
    const cur = this.q[0];
    if (!cur) return;

    await cur.tick(dt);
    if (cur.state === "done") this.q.shift();
    else if (cur.state === "paused" && !cur.isBlocking) {
    }
  }
}

// context
export interface IMemory {
  getHostility(id: string): number;
  remember(evt: GameEvent): void;
}
export interface IEmotion {
  evaluate(v: number): number;
}
export interface IHabit {
  bias(v: number): number;
}
export interface IRole {
  roles: Set<string>;
  has(role: string): boolean;
}
export interface IStatus {
  hp: number;
  fatiguq: number;
}

export interface IContext {
  memory: IMemory;
  emotion: IEmotion;
  habit: IHabit;
  role: IRole;
  status: IStatus;
}

export class SimpleMemory implements IMemory {
  private hostile = new Map<string, number>();
  getHostility(id: string): number {
    return this.hostile.get(id) ?? 0;
  }
  remember(evt: GameEvent): void {
    if (evt.type === "attacked") {
      this.hostile.set(evt.payload.attacker, 100);
    }
  }
}

// sensor
export interface PerceiveObject {
  id: string;
  pos: Position;
  movement: "idle" | "walk" | "stealth";
  distance: number;
}

export interface ISensor {
  sense(ctx: GameContext): PerceiveObject[];
}

export class VisualSensor implements ISensor {
  constructor(private selfPos: () => Position, private range = 15) {}
  sense(ctx: GameContext): PerceiveObject[] {
    return ctx
      .getEntitiesInRadius(this.selfPos(), this.range)
      .filter((e) => e !== undefined)
      .map((e) => ({
        id: e!.id,
        pos: (e as any).position ?? { x: 0, y: 0 },
        movement: "walk",
        distance: 5,
      }));
  }
}

export interface IInterpreter {
  interpret(obs: PerceiveObject[], ctx: IContext): Task;
}

export class FsmInterpreter implements IInterpreter {
  interpret(obs: PerceiveObject[], ctx: IContext): Task {
    const hostile = obs.find(
      (o) => ctx.memory.getHostility(o.id) > 50 && o.distance < 10
    );
    if (hostile) {
      return new SyncTask(() => console.log("Attack", hostile.id));
    }
    return new SyncTask(() => console.log("Idle"));
  }
}

export interface IEntity {
  id: string;
  update(ctx?: GameContext): void;
}

export class ContextualNPC implements IEntity {
  private taskQ = new TaskQueue();
  constructor(
    public id: string,
    private sensor: ISensor,
    private interpreter: IInterpreter,
    private context: IContext
  ) {}
  async update(ctx?: GameContext): Promise<void> {
    if (!ctx) return;
    const obs = this.sensor.sense(ctx);
    const task = this.interpreter.interpret(obs, this.context);
    this.taskQ.push(task);
    await this.taskQ.tick();
  }
}

export class FlameTrap implements IEntity {
  private state: "waiting" | "firing" = "waiting";
  constructor(public id: string, public position: Position) {}
  update(ctx?: GameContext) {
    if (!ctx) return;
    const player = ctx.getEntity("player") as any;
    if (!player) return;
    const dist = Math.hypot(
      player.position.x - this.position.x,
      player.position.y - this.position.y
    );
    if (this.state === "waiting" && dist < 5) {
      this.state = "firing";
      console.log("FlameTrap fires!");
    }
  }
}

export class Rock implements IEntity {
  constructor(public id: string, public position: Position) {}
  update() {}
}

// mainループ
async function gameLoop(entities: IEntity[], ctx: GameContext) {
  for (const e of entities) {
    e.update(ctx);
  }
}
