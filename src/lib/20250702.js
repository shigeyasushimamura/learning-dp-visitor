var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Component = /** @class */ (function () {
    function Component(mediator) {
        this.mediator = mediator;
    }
    Component.prototype.setMediator = function (mediator) {
        this.mediator = mediator;
    };
    return Component;
}());
var ConcreteMediator = /** @class */ (function () {
    function ConcreteMediator(cA, cB) {
        this.componentA = cA;
        this.componentA.setMediator(this);
        this.componentB = cB;
        this.componentB.setMediator(this);
    }
    ConcreteMediator.prototype.notify = function (sender, event) {
        if (event === "A_EVENT") {
            console.log("Mediator reacts to A_EVENT and triggers B's action.");
            this.componentB.doB();
        }
        else if (event === "B_EVENT") {
            console.log("Mediator reacts to B_EVENT and triggers A's action.");
            this.componentA.doA();
        }
    };
    return ConcreteMediator;
}());
var ComponentA = /** @class */ (function (_super) {
    __extends(ComponentA, _super);
    function ComponentA() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComponentA.prototype.doA = function () {
        console.log("ComponentA does A");
    };
    ComponentA.prototype.triggerA = function () {
        var _a;
        console.log("ComponentA triggers event A_EVENT");
        (_a = this.mediator) === null || _a === void 0 ? void 0 : _a.notify(this, "A_EVENT");
    };
    return ComponentA;
}(Component));
var ComponentB = /** @class */ (function (_super) {
    __extends(ComponentB, _super);
    function ComponentB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComponentB.prototype.doB = function () {
        console.log("ComponentB does B");
    };
    ComponentB.prototype.triggerB = function () {
        var _a;
        console.log("ComponentB triggers event B_EVENT");
        (_a = this.mediator) === null || _a === void 0 ? void 0 : _a.notify(this, "B_EVENT");
    };
    return ComponentB;
}(Component));
var componentA = new ComponentA();
var componentB = new ComponentB();
var mediator = new ConcreteMediator(componentA, componentB);
componentA.triggerA();
// => ComponentA triggers event A_EVENT
// => Mediator reacts to A_EVENT and triggers B's action.
// => ComponentB does B
componentB.triggerB();
// => ComponentB triggers event B_EVENT
// => Mediator reacts to B_EVENT and triggers A's action.
// => ComponentA does A
var SimpleMediator = /** @class */ (function () {
    function SimpleMediator() {
        this.handlers = [];
    }
    SimpleMediator.prototype.subscribe = function (handler) {
        this.handlers.push(handler);
    };
    SimpleMediator.prototype.notify = function (msg) {
        this.handlers.forEach(function (handler) { return handler(msg); });
    };
    return SimpleMediator;
}());
var mediator2 = new SimpleMediator();
mediator2.subscribe(function (msg) { return console.log("Handler1 received", msg); });
mediator2.notify("Hello Typescript");
