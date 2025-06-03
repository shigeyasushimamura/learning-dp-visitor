var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.length = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector2.prototype.normalize = function () {
        var len = this.length();
        return new Vector2(this.x / len, this.y / len);
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2.prototype.angleBetween = function (v) {
        var dotProduct = this.dot(v);
        var cosTheta = dotProduct / (this.length() * v.length());
        return Math.acos(cosTheta) * (180 / Math.PI); // 角度（度数）で返す
    };
    return Vector2;
}());
// 例：敵の視線ベクトルと、プレイヤーの位置からみた方向ベクトル
var enemyPos = new Vector2(0, 0);
var enemyViewDir = new Vector2(1, 0); // 右を向いている
var playerPos = new Vector2(1, 1); // 右上にプレイヤーがいる
var toPlayer = new Vector2(playerPos.x - enemyPos.x, playerPos.y - enemyPos.y).normalize();
var viewDirNormalized = enemyViewDir.normalize();
var angle = viewDirNormalized.angleBetween(toPlayer);
console.log("\u6575\u304C\u30D7\u30EC\u30A4\u30E4\u30FC\u3092\u8996\u8A8D\u3059\u308B\u306B\u306F\u8996\u7DDA\u3092 ".concat(angle.toFixed(2), " \u5EA6\u56DE\u8EE2\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002"));
