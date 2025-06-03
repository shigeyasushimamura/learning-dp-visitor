class Vector2 {
  constructor(public x: number, public y: number) {}

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize(): Vector2 {
    const len = this.length();
    return new Vector2(this.x / len, this.y / len);
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  angleBetween(v: Vector2): number {
    const dotProduct = this.dot(v);
    const cosTheta = dotProduct / (this.length() * v.length());
    return Math.acos(cosTheta) * (180 / Math.PI); // 角度（度数）で返す
  }
}

// 例：敵の視線ベクトルと、プレイヤーの位置からみた方向ベクトル
const enemyPos = new Vector2(0, 0);
const enemyViewDir = new Vector2(1, 0); // 右を向いている

const playerPos = new Vector2(1, 1); // 右上にプレイヤーがいる

const toPlayer = new Vector2(
  playerPos.x - enemyPos.x,
  playerPos.y - enemyPos.y
).normalize();

const viewDirNormalized = enemyViewDir.normalize();

const angle = viewDirNormalized.angleBetween(toPlayer);

console.log(
  `敵がプレイヤーを視認するには視線を ${angle.toFixed(
    2
  )} 度回転する必要があります。`
);
