type Maze = string[][];

function canReachGoal(maze: Maze): boolean {
  const h = maze.length;
  const w = maze[0].length;

  let startRow = -1;
  let startCol = -1;

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (maze[i][j] === "S") {
        startCol = j;
        startRow = i;
      }
    }
  }

  if (startRow === -1 || startCol === -1) {
    throw new Error("Start position not found");
  }

  const visited: boolean[][] = Array.from({ length: h }, () =>
    Array(w).fill(false)
  );

  const dfs = (r: number, c: number): boolean => {
    if (r < 0 || r >= h || c < 0 || c >= w) return false;
    if (maze[r][c] === "#") return false;
    if (visited[r][c]) return false;
    if (maze[r][c] === "G") return true;

    visited[r][c] = true;

    // 上下左右
    if (dfs(r - 1, c)) return true;
    if (dfs(r + 1, c)) return true;
    if (dfs(r, c - 1)) return true;
    if (dfs(r, c + 1)) return true;

    return false;
  };

  return dfs(startRow, startCol);
}

// === テスト用 ===
const maze: Maze = [
  ["#", "#", "#", "#", "#", "#"],
  ["#", "S", ".", ".", "G", "#"],
  ["#", "#", "#", ".", "#", "#"],
  ["#", ".", ".", ".", ".", "#"],
  ["#", "#", "#", "#", "#", "#"],
];

console.log(canReachGoal(maze)); // true

function findPath(maze: Maze): [number, number][] | null {
  const h = maze.length;
  const w = maze[0].length;

  let startRow = -1;
  let startCol = -1;

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (maze[i][j] === "S") {
        startRow = i;
        startCol = j;
      }
    }
  }

  if (startRow === -1 || startCol === -1) {
    throw new Error("Start not found");
  }

  const visited: boolean[][] = Array.from({ length: h }, () =>
    Array(w).fill(false)
  );
  const prev: [number, number][][] = Array.from({ length: h }, () =>
    Array(w).fill(null)
  );

  let goalRow = -1;
  let goalCol = -1;

  const dfs = (r: number, c: number): boolean => {
    if (r < 0 || r >= h || c < 0 || c >= w) return false;
    if (maze[r][c] === "#") return false;
    if (visited[r][c]) return false;

    visited[r][c] = true;

    if (maze[r][c] === "G") {
      goalRow = r;
      goalCol = c;
      return true;
    }

    const dirs: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (!visited[nr]?.[nc] && maze[nr]?.[nc] !== "#") {
        prev[nr][nc] = [r, c];
        if (dfs(nr, nc)) return true;
      }
    }
    return false;
  };

  if (!dfs(startRow, startCol)) return null;

  // ゴールからスタートまで経路を復元
  const path: [number, number][] = [];
  let cur: [number, number] | null = [goalRow, goalCol];
  while (cur && maze[cur[0]][cur[1]] !== "S") {
    path.push(cur);
    cur = prev[cur[0]][cur[1]];
  }
  path.push([startRow, startCol]); // スタートも含める
  path.reverse();

  return path;
}

// === テスト ===
const maze2: Maze = [
  ["#", "#", "#", "#", "#", "#"],
  ["#", "S", ".", ".", "G", "#"],
  ["#", "#", "#", ".", "#", "#"],
  ["#", ".", ".", ".", ".", "#"],
  ["#", "#", "#", "#", "#", "#"],
];

const path = findPath(maze2);
console.log(path);
