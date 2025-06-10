const DESIRABLE_NUGGET_SIZE = 10;
const UNPATIENCE_THIRSTY_VALUE = 10;

abstract class BaseGameEntity {
  private m_ID: number = 0;
  static m_iNextValidID: number = 0;

  constructor(id: number) {
    this.setID(id);
  }

  setID(val: number) {
    this.m_ID = val;
  }

  getID() {
    return this.m_ID;
  }

  abstract Update(): void;
}

abstract class State<T> {
  abstract Enter(entity: T): void;
  abstract Execute(entity: T): void;
  abstract Exit(entity: T): void;
}

class Miner extends BaseGameEntity {
  private m_pCurrentState: State<Miner> | undefined;
  private m_Location: location_type | undefined;
  private m_iGoldCarryied: number = 0;
  private m_iMoneyInBank: number = 0;
  private m_iThirst: number = 0;
  private m_iFatigue: number = 0;

  constructor(ID: number) {
    super(ID);
  }

  Update(): void {
    this.m_iThirst += 1;
    if (this.m_pCurrentState) {
      this.m_pCurrentState.Execute(this);
    }
  }

  ChangeState(pNewState: State<Miner>) {
    if (!this.m_pCurrentState || !pNewState) {
      return;
    }

    this.m_pCurrentState.Exit(this);
    this.m_pCurrentState = pNewState;
    this.m_pCurrentState.Enter(this);
  }

  RevertToPreviousState() {}

  Location() {
    return this.m_Location;
  }

  ChangeLocation(l: location_type) {
    this.m_Location = l;
  }

  AddToGoldCarried(i: number) {
    this.m_iGoldCarryied += i;
  }

  IncreaseFatigue(i: number) {
    this.m_iFatigue += i;
  }

  PocketFull() {
    return this.m_iGoldCarryied >= DESIRABLE_NUGGET_SIZE;
  }

  Thirsty() {
    return this.m_iThirst >= UNPATIENCE_THIRSTY_VALUE;
  }
}

type location_type = "goldmine";

class EnterMineAndDigForNugget extends State<Miner> {
  private static instance: EnterMineAndDigForNugget;

  private constructor() {
    super();
  }

  static Instance(): EnterMineAndDigForNugget {
    if (!EnterMineAndDigForNugget.instance) {
      EnterMineAndDigForNugget.instance = new EnterMineAndDigForNugget();
    }
    return EnterMineAndDigForNugget.instance;
  }

  Enter(pMiner: Miner): void {
    if (pMiner.Location() != "goldmine") {
      console.log("Walking to the gold mine");
      pMiner.ChangeLocation("goldmine");
    }
  }
  Execute(e: Miner): void {
    e.AddToGoldCarried(1);
    e.IncreaseFatigue(1);

    console.log("Pickin up a nugget");

    if (e.PocketFull()) {
      e.ChangeState(VisitBankAndDepositGold.Instance());
    }

    if (e.Thirsty()) {
      e.ChangeState(QuenchThirst.Instance());
    }
  }
  Exit(e: Miner): void {
    console.log(
      "Ah i am leavin the gold mine with ma pocket full o sweet gold"
    );
  }
}

class QuenchThirst extends State<Miner> {
  private static instance: QuenchThirst;

  private constructor() {
    super();
  }

  static Instance(): QuenchThirst {
    if (!QuenchThirst.instance) {
      QuenchThirst.instance = new QuenchThirst();
    }
    return QuenchThirst.instance;
  }
  Enter(e: Miner): void {}

  Execute(e: Miner): void {}
  Exit(e: Miner): void {}
}

class VisitBankAndDepositGold extends State<Miner> {
  private static instance: VisitBankAndDepositGold;

  private constructor() {
    super();
  }

  static Instance(): VisitBankAndDepositGold {
    if (!VisitBankAndDepositGold.instance) {
      VisitBankAndDepositGold.instance = new VisitBankAndDepositGold();
    }

    return VisitBankAndDepositGold.instance;
  }

  Enter(e: Miner): void {}

  Execute(e: Miner): void {}
  Exit(e: Miner): void {}
}

export class Telegram {
  constructor(
    public Sender: number,
    public Receiver: number,
    public Msg: number,
    public DispatchTime: number,
    public ExtraInfo: any
  ) {}
}

enum Message_Type {
  Msg_HiHoney_ImHome,
  Msg_StewReady,
}

// EntityのIDを管理
export class EntityManager {
  private static instance: EntityManager;
  private EntityMap: Map<number, BaseGameEntity> = new Map();

  static Instance() {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }
  RegisterEntity(NewEntity: BaseGameEntity) {
    EntityManager.instance.EntityMap.set(NewEntity.getID(), NewEntity);
  }
  GetEntityFromID(id: number) {
    return EntityManager.instance.EntityMap.get(id);
  }
  RemoveEntity(pEntity: BaseGameEntity) {
    EntityManager.instance.EntityMap.delete(pEntity.getID());
  }
}

// メッセージの生成・送信を管理
export class MessageDispatcher {
  private static instance: MessageDispatcher;
  PriorityQ: Array<Telegram> = new Array();

  static Instance() {
    if (!MessageDispatcher.instance) {
      MessageDispatcher.instance = new MessageDispatcher();
    }
    return MessageDispatcher.instance;
  }

  Discharge(pReceiver: BaseGameEntity, msg: Telegram) {}

  DispatchMessage(
    delay: number,
    sender: number,
    receiver: number,
    msg: number,
    ExtraInfo: any
  ) {
    const EntityMgr = EntityManager.Instance();
    const pReceiver = EntityMgr.GetEntityFromID(receiver);
    const telegram = new Telegram(sender, receiver, msg, delay, ExtraInfo);

    if (!pReceiver) return;

    if (delay <= 0) {
      this.Discharge(pReceiver, telegram);
    } else {
      const crrTime = Date.now();
      telegram.DispatchTime = delay + crrTime;
      this.PriorityQ.push(telegram);
    }
  }

  DispatchDelayedMessages() {}
}
