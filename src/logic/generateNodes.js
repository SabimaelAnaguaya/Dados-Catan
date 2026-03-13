export function generateNodes(hexes, size = 130) {
  const nodes = new Map();

  for (const hex of hexes) {
    // Convertir axial → pixel
    const centerX = 400 + size * (Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r);
    const centerY = 400 + size * (3/2 * hex.r);

    // Generar 6 esquinas
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i + Math.PI / 6;
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);

      // Redondeo para evitar duplicados
      const key = `${Math.round(x)},${Math.round(y)}`;

      if (!nodes.has(key)) {
        nodes.set(key, {
          id: `n${nodes.size + 1}`,
          x: Math.round(x),
          y: Math.round(y),
          building: null, // casa, castillo o null
          points: 1       // luego lo ajustamos según tu tablero
        });
      }
    }
  }

  function getHexNodes(hex, nodes, size = 130) {
  const centerX = 400 + size * (Math.sqrt(3) * hex.q + Math.sqrt(3)/2 * hex.r);
  const centerY = 400 + size * (3/2 * hex.r);

  const hexNodes = [];

  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i + Math.PI / 6;
    const x = Math.round(centerX + size * Math.cos(angle));
    const y = Math.round(centerY + size * Math.sin(angle));

    const node = nodes.find(n => n.x === x && n.y === y);
    if (node) hexNodes.push(node.id);
  }

  return hexNodes;
}


  return Array.from(nodes.values());
}
