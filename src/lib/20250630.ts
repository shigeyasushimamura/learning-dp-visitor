type Edge = {
  to: number;
  cost: number;
};

function dijkstra(graph: Edge[][], start: number): number[] {
  const n = graph.length;
  const dist: number[] = Array(n).fill(Infinity);
  dist[start] = 0;

  const visited: boolean[] = Array(n).fill(false);

  // 簡単のため、ここでは最小ヒープの代わりに単純探索
  for (let i = 0; i < n; i++) {
    let v = -1;
    for (let u = 0; u < n; u++) {
      if (!visited[u] && (v === -1 || dist[u] < dist[v])) {
        v = u;
      }
    }

    if (dist[v] === Infinity) break;

    visited[v] = true;

    for (const edge of graph[v]) {
      if (dist[edge.to] > dist[v] + edge.cost) {
        dist[edge.to] = dist[v] + edge.cost;
      }
    }
  }

  return dist;
}

// === サンプルグラフ ===
//
// 0 → 1 (距離 2)
// 0 → 2 (距離 5)
// 1 → 2 (距離 1)
// 1 → 3 (距離 4)
// 2 → 3 (距離 1)
//
// グラフ定義
const graph: Edge[][] = [
  [
    { to: 1, cost: 2 },
    { to: 2, cost: 5 },
  ],
  [
    { to: 2, cost: 1 },
    { to: 3, cost: 4 },
  ],
  [{ to: 3, cost: 1 }],
  [],
];

const dist = dijkstra(graph, 0);

console.log(dist); // [0, 2, 3, 4]

function dijkstraWithHeap(graph: Edge[][], start: number): number[] {
  const n = graph.length;
  const dist: number[] = Array(n).fill(Infinity);
  dist[start] = 0;

  const visited: boolean[] = Array(n).fill(false);

  const heap = new Queue<[number, number]>(); // [距離, 頂点]
  heap.push([0, start]);

  while (!heap.isEmpty()) {
    const [d, v] = heap.pop();
    if (visited[v]) continue;
    visited[v] = true;

    for (const edge of graph[v]) {
      const to = edge.to;
      const cost = edge.cost;
      if (dist[v] + cost < dist[to]) {
        dist[to] = dist[v] + cost;
        heap.push([dist[to], to]);
      }
    }
  }
  return dist;
}
