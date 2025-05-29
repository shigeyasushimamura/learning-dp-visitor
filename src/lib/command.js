var Player = /** @class */ (function () {
    function Player() {
        this.x = 0;
        this.y = 0;
    }
    Player.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        console.log("Moved to (".concat(this.x, ", ").concat(this.y, ")"));
    };
    Player.prototype.getPosition = function () {
        return { x: this.x, y: this.y };
    };
    return Player;
}());
var MoveCommand = /** @class */ (function () {
    function MoveCommand(player, dx, dy) {
        this.player = player;
        this.dx = dx;
        this.dy = dy;
        this.prevX = 0;
        this.prevY = 0;
    }
    MoveCommand.prototype.execute = function () {
        var _a = this.player.getPosition(), x = _a.x, y = _a.y;
        this.prevX = x;
        this.prevY = y;
        this.player.setPosition(x + this.dx, y + this.dy);
        console.log("execute!");
        console.log("Player:", this.player.getPosition());
    };
    MoveCommand.prototype.undo = function () {
        this.player.setPosition(this.prevX, this.prevY);
        console.log("undo!");
        console.log("Player:", this.player.getPosition());
    };
    return MoveCommand;
}());
var CommandManager = /** @class */ (function () {
    function CommandManager() {
        this.history = [];
    }
    CommandManager.prototype.executeCommand = function (cmd) {
        cmd.execute();
        this.history.push(cmd);
    };
    CommandManager.prototype.undo = function () {
        var commnad = this.history.pop();
        if (commnad) {
            commnad.undo();
        }
    };
    CommandManager.prototype.undoAll = function () {
        while (this.history.length > 0) {
            this.undo();
        }
    };
    return CommandManager;
}());
var player = new Player();
var manager = new CommandManager();
manager.executeCommand(new MoveCommand(player, 1, 0)); // → (1,0)
manager.executeCommand(new MoveCommand(player, 0, 2)); // ↓ (1,2)
manager.executeCommand(new MoveCommand(player, -1, -1)); // ←↑ (0,1)
manager.undo(); // (1,2)
manager.undo(); // (1,0)
manager.undo(); // (0,0)
