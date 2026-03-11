export function generateEdges(nodes, hexes, size = 130) {
  const edges = new Map();

  // Función para obtener las esquinas de un hex
  function getHexCorners(hex) {
    const centerX = 400 + size * (Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r);
    const centerY = 400 + size * (3/2 * hex.r);

    return Array.from({ length: 6 }, (_, i) => {
      const angle = Math.PI / 3 * i + Math.PI / 6;
      const x = Math.round(centerX + size * Math.cos(angle));
      const y = Math.round(centerY + size * Math.sin(angle));
      return { x, y };
    });
  }

  // Convertir nodos a un mapa rápido por coordenadas
  const nodeMap = new Map();
  for (const node of nodes) {
    const key = `${node.x},${node.y}`;
    nodeMap.set(key, node.id);
  }

  // Generar edges por hexágono
  for (const hex of hexes) {
    const corners = getHexCorners(hex);

    for (let i = 0; i < 6; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % 6];

      const keyA = `${a.x},${a.y}`;
      const keyB = `${b.x},${b.y}`;

      const nodeA = nodeMap.get(keyA);
      const nodeB = nodeMap.get(keyB);

      if (!nodeA || !nodeB) continue;

      // Normalizar el ID del edge (para evitar duplicados)
      const edgeKey = nodeA < nodeB ? `${nodeA}-${nodeB}` : `${nodeB}-${nodeA}`;

      if (!edges.has(edgeKey)) {
        edges.set(edgeKey, {
          id: `e${edges.size + 1}`,
          from: nodeA,
          to: nodeB,
          built: false, // si ya se construyó
          points: 1     // luego ajustamos según tu tablero
        });
      }
    }
  }

  return Array.from(edges.values());
}
