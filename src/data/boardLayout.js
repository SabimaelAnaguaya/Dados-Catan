const size = 130; // MISMO size que HexTile y generateNodes
const offsetX = 400;
const offsetY = 400;

function axialToPixel(q, r) {
  const x = offsetX + size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
  const y = offsetY + size * (3/2 * r);
  return { x, y };
}

export const boardLayout = {
  hexes: [
    { id: "h1", q: 1, r: -1, resource: "piedra" },
    { id: "h2", q: 0, r: -1, resource: "oveja" },
    { id: "h3", q: -1, r: 0, resource: "madera" },
    { id: "h4", q: -1, r: 1, resource: "trigo" },
    { id: "h5", q: 0, r: 1, resource: "madera" },
    { id: "h6", q: 1, r: 0, resource: "ladrillo" },
  ].map(hex => ({
    ...hex,
    center: axialToPixel(hex.q, hex.r),
    nodes: [] // se llenará en Board.svelte
  }))
};
