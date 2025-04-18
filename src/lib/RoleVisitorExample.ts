// -------------------- 基本型定義 --------------------
interface IEntity {
  name: string;
  getContext(): RoleContext | undefined;
  setContext(ctx: RoleContext): void;
}

class BaseEntity implements IEntity {
  constructor(public name: string, private context?: RoleContext) {}
  getContext() {
    return this.context;
  }
  setContext(ctx: RoleContext) {
    this.context = ctx;
  }
}

// -------------------- Role Context & Role --------------------
interface IRole {
  type: string;
}

class RoleContext {
  private roles = new Map<string, IRole>();

  addRole(role: IRole) {
    this.roles.set(role.type, role);
  }

  getRole<T extends IRole>(type: string): T | undefined {
    return this.roles.get(type) as T | undefined;
  }

  hasRole(type: string): boolean {
    return this.roles.has(type);
  }
}

// -------------------- Talk Role（木構造パターン） --------------------
abstract class TalkRole implements IRole {
  readonly type = "talk";
  abstract interact(entity: IEntity): string;
}

class CharacterTalkRole extends TalkRole {
  interact(entity: IEntity): string {
    return `${entity.name} は話しかけた：「こんにちは！」`;
  }
}

class ObjectTalkRole extends TalkRole {
  interact(entity: IEntity): string {
    return `${entity.name} を調べた：古い石碑に何かが書かれている...`;
  }
}

// -------------------- Visitorパターン --------------------
interface InteractionVisitor {
  visitTalk(entity: IEntity, role: TalkRole): string;
}

class LoggingVisitor implements InteractionVisitor {
  visitTalk(entity: IEntity, role: TalkRole): string {
    const message = role.interact(entity);
    console.log(`[LOG] Talk event: ${message}`);
    return message;
  }
}

// -------------------- 利用例 --------------------
const npc = new BaseEntity("村人A");
npc.setContext(new RoleContext());
npc.getContext()?.addRole(new CharacterTalkRole());

const stone = new BaseEntity("石碑");
stone.setContext(new RoleContext());
stone.getContext()?.addRole(new ObjectTalkRole());

function talk(entity: IEntity, visitor: InteractionVisitor): string {
  const role = entity.getContext()?.getRole<TalkRole>("talk");
  if (!role) return `${entity.name} は話すことができない。`;
  return visitor.visitTalk(entity, role);
}

const visitor = new LoggingVisitor();
console.log(talk(npc, visitor)); // 村人A は話しかけた：「こんにちは！」
console.log(talk(stone, visitor)); // 石碑 を調べた：古い石碑に何かが書かれている...
