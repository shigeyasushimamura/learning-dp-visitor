function canReachGoal(maze) {
    var h = maze.length;
    var w = maze[0].length;
    var startRow = -1;
    var startCol = -1;
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            if (maze[i][j] === "S") {
                startCol = j;
                startRow = i;
            }
        }
    }
    if (startRow === -1 || startCol === -1) {
        throw new Error("Start position not found");
    }
    var visited = Array.from({ length: h }, function () {
        return Array(w).fill(false);
    });
    var dfs = function (r, c) {
        if (r < 0 || r >= h || c < 0 || c >= w)
            return false;
        if (maze[r][c] === "#")
            return false;
        if (visited[r][c])
            return false;
        if (maze[r][c] === "G")
            return true;
        visited[r][c] = true;
        // 上下左右
        if (dfs(r - 1, c))
            return true;
        if (dfs(r + 1, c))
            return true;
        if (dfs(r, c - 1))
            return true;
        if (dfs(r, c + 1))
            return true;
        return false;
    };
    return dfs(startRow, startCol);
}
// === テスト用 ===
var maze = [
    ["#", "#", "#", "#", "#", "#"],
    ["#", "S", ".", ".", "G", "#"],
    ["#", "#", "#", ".", "#", "#"],
    ["#", ".", ".", ".", ".", "#"],
    ["#", "#", "#", "#", "#", "#"],
];
console.log(canReachGoal(maze)); // true
function findPath(maze) {
    var h = maze.length;
    var w = maze[0].length;
    var startRow = -1;
    var startCol = -1;
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            if (maze[i][j] === "S") {
                startRow = i;
                startCol = j;
            }
        }
    }
    if (startRow === -1 || startCol === -1) {
        throw new Error("Start not found");
    }
    var visited = Array.from({ length: h }, function () {
        return Array(w).fill(false);
    });
    var prev = Array.from({ length: h }, function () {
        return Array(w).fill(null);
    });
    var goalRow = -1;
    var goalCol = -1;
    var dfs = function (r, c) {
        var _a, _b;
        if (r < 0 || r >= h || c < 0 || c >= w)
            return false;
        if (maze[r][c] === "#")
            return false;
        if (visited[r][c])
            return false;
        visited[r][c] = true;
        if (maze[r][c] === "G") {
            goalRow = r;
            goalCol = c;
            return true;
        }
        var dirs = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];
        for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
            var _c = dirs_1[_i], dr = _c[0], dc = _c[1];
            var nr = r + dr;
            var nc = c + dc;
            if (!((_a = visited[nr]) === null || _a === void 0 ? void 0 : _a[nc]) && ((_b = maze[nr]) === null || _b === void 0 ? void 0 : _b[nc]) !== "#") {
                prev[nr][nc] = [r, c];
                if (dfs(nr, nc))
                    return true;
            }
        }
        return false;
    };
    if (!dfs(startRow, startCol))
        return null;
    // ゴールからスタートまで経路を復元
    var path = [];
    var cur = [goalRow, goalCol];
    while (cur && maze[cur[0]][cur[1]] !== "S") {
        path.push(cur);
        cur = prev[cur[0]][cur[1]];
    }
    path.push([startRow, startCol]); // スタートも含める
    path.reverse();
    return path;
}
// === テスト ===
var maze2 = [
    ["#", "#", "#", "#", "#", "#"],
    ["#", "S", ".", ".", "G", "#"],
    ["#", "#", "#", ".", "#", "#"],
    ["#", ".", ".", ".", ".", "#"],
    ["#", "#", "#", "#", "#", "#"],
];
var path = findPath(maze2);
console.log(path);
