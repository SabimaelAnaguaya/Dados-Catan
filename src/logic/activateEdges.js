export function activateEdges(edges, allowedIds = []) {
  return edges.map(edge => ({
    ...edge,
    active: allowedIds.includes(edge.id),
    available: false,   // se puede comprar?
    built: false,       // ya comprado?
    points: 1           // cada camino vale 1 punto
  }));
}
