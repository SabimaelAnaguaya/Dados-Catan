export function activateNodes(nodes, allowedIds = [], pointsMap = {}, buildingMap = {}) {
  return nodes.map(node => ({
    ...node,
    active: allowedIds.includes(node.id),
    available: false,
    built: false,
    points: pointsMap[node.id] ?? 0,
    building: buildingMap[node.id] ?? null
  }));
}
