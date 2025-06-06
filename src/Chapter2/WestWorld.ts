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

class EnterMineAndDigForNugget extends State {
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

class QuenchThirst extends State {
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

class VisitBankAndDepositGold extends State {
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
