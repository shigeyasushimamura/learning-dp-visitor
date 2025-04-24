// -------------------- Context Orchestrator --------------------

interface IEntityContext {
  role?: RoleContext;
  goal?: GoalContext;
  inventory?: InventoryContext;
  environment?: EnvironmentContext;
  status?: StatusContext;
}

class ContextOrchestrator {
  constructor(private context: IEntityContext) {}

  canTalk(): boolean {
    return !!this.context.role?.hasRole("talk");
  }

  isInCombat(): boolean {
    return (
      !!this.context.role?.hasRole("combat") && this.context.status?.hp > 0
    );
  }

  shouldEscape(): boolean {
    return (
      this.context.status?.hp !== undefined &&
      this.context.status.hp < 10 &&
      this.context.environment?.isDark
    );
  }

  currentGoal(): string {
    return this.context.goal?.getCurrentGoal() ?? "目的なし";
  }

  evaluateActionAvailability(action: string): boolean {
    switch (action) {
      case "talk":
        return this.canTalk();
      case "attack":
        return this.isInCombat();
      case "escape":
        return this.shouldEscape();
      default:
        return false;
    }
  }
}

// -------------------- 仮のContext実装サンプル --------------------

class RoleContext {
  private roles = new Map<string, any>();
  addRole(type: string, role: any) {
    this.roles.set(type, role);
  }
  hasRole(type: string): boolean {
    return this.roles.has(type);
  }
}

class GoalContext {
  getCurrentGoal(): string {
    return "クエスト#7を完了する";
  }
}

class InventoryContext {
  // アイテム・装備に関する管理
}

class EnvironmentContext {
  isDark: boolean = false;
  isRaining: boolean = false;
}

class StatusContext {
  hp: number = 100;
  fatigue: number = 0;
}
