interface MediatorSample {
  notify(sender: ComponentSample, event: string): void;
}

abstract class ComponentSample {
  protected MediatorSample?: MediatorSample;

  constructor(MediatorSample?: MediatorSample) {
    this.MediatorSample = MediatorSample;
  }

  setMediatorSample(MediatorSample: MediatorSample) {
    this.MediatorSample = MediatorSample;
  }
}

class ConcreteMediatorSample implements MediatorSample {
  private ComponentSampleA: ComponentSampleA;
  private ComponentSampleB: ComponentSampleB;

  constructor(cA: ComponentSampleA, cB: ComponentSampleB) {
    this.ComponentSampleA = cA;
    this.ComponentSampleA.setMediatorSample(this);
    this.ComponentSampleB = cB;
    this.ComponentSampleB.setMediatorSample(this);
  }

  notify(sender: ComponentSample, event: string): void {
    if (event === "A_EVENT") {
      console.log("MediatorSample reacts to A_EVENT and triggers B's action.");
      this.ComponentSampleB.doB();
    } else if (event === "B_EVENT") {
      console.log("MediatorSample reacts to B_EVENT and triggers A's action.");
      this.ComponentSampleA.doA();
    }
  }
}
class ComponentSampleA extends ComponentSample {
  doA() {
    console.log("ComponentSampleA does A");
  }

  triggerA() {
    console.log("ComponentSampleA triggers event A_EVENT");
    this.MediatorSample?.notify(this, "A_EVENT");
  }
}

class ComponentSampleB extends ComponentSample {
  doB() {
    console.log("ComponentSampleB does B");
  }

  triggerB() {
    console.log("ComponentSampleB triggers event B_EVENT");
    this.MediatorSample?.notify(this, "B_EVENT");
  }
}

const componentSampleA = new ComponentSampleA();
const componentSampleB = new ComponentSampleB();

const MediatorSample = new ConcreteMediatorSample(
  componentSampleA,
  componentSampleB
);

componentSampleA.triggerA();
// => ComponentSampleA triggers event A_EVENT
// => MediatorSample reacts to A_EVENT and triggers B's action.
// => ComponentSampleB does B

componentSampleB.triggerB();
// => ComponentSampleB triggers event B_EVENT
// => MediatorSample reacts to B_EVENT and triggers A's action.
// => ComponentSampleA does A

class SimpleMediatorSample {
  private handlers: ((msg: string) => void)[] = [];

  subscribe(handler: (msg: string) => void) {
    this.handlers.push(handler);
  }

  notify(msg: string) {
    this.handlers.forEach((handler) => handler(msg));
  }
}

const MediatorSample2 = new SimpleMediatorSample();

MediatorSample2.subscribe((msg) => console.log("Handler1 received", msg));

MediatorSample2.notify("Hello Typescript");

// Mediatorインターフェース
interface Mediator {
  notify(sender: string, event: string): void;
}

// 具体的なMediator
class FormMediator implements Mediator {
  private components: Record<string, Component>;

  constructor() {
    this.components = {};
  }

  register(name: string, component: Component) {
    this.components[name] = component;
    component.setMediator(this);
  }

  notify(sender: string, event: string): void {
    if (sender === "inputA" && event === "valueChanged") {
      this.components["inputB"]?.update("Aが変わったからBをリセット");
    }

    if (sender === "inputB" && event === "valueChanged") {
      this.components["summary"]?.update("Bが変わったのでサマリー更新");
    }
  }
}

// コンポーネント基底クラス
abstract class Component {
  protected mediator?: Mediator;

  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }

  abstract update(value: string): void;
}

// 具体コンポーネント
class InputA extends Component {
  changeValue() {
    console.log("InputA: 値が変わりました");
    this.mediator?.notify("inputA", "valueChanged");
  }

  update(value: string) {
    console.log("InputA update:", value);
  }
}

class InputB extends Component {
  changeValue() {
    console.log("InputB: 値が変わりました");
    this.mediator?.notify("inputB", "valueChanged");
  }

  update(value: string) {
    console.log("InputB update:", value);
  }
}

class Summary extends Component {
  update(value: string) {
    console.log("Summary update:", value);
  }
}

// Mediator & Componentsをセットアップ
const mediator = new FormMediator();

const inputA = new InputA();
const inputB = new InputB();
const summary = new Summary();

mediator.register("inputA", inputA);
mediator.register("inputB", inputB);
mediator.register("summary", summary);

// テスト動作
inputA.changeValue();
// => InputA: 値が変わりました
// => InputB update: Aが変わったからBをリセット

inputB.changeValue();
// => InputB: 値が変わりました
// => Summary update: Bが変わったのでサマリー更新

// Mediator 目的: グループ内部のオブジェクト同士の「相互作用」を整理し、オブジェクト間の依存関係を減らす。
// Facade Facade 目的: サブシステムの複雑さを外部から隠し、統一的でシンプルなインターフェースを提供する。
