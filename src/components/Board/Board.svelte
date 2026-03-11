<script>
  import { boardLayout } from "../../data/boardLayout.js";
  import HexTile from "./HexTile.svelte";
  import Node from "./Node.svelte";
  import Edge from "./Edge.svelte";
  import KnightSpot from "./KnightSpot.svelte";

  import { generateNodes } from "../../logic/generateNodes.js";
  import { generateEdges } from "../../logic/generateEdges.js";
  
  import { activateNodes } from "../../logic/activateNodes.js";
  import { activateEdges } from "../../logic/activateEdges.js";

  export { nodes, edges };

  // Generación automática
  const rawNodes = generateNodes(boardLayout.hexes);
  const rawEdges = generateEdges(rawNodes, boardLayout.hexes);

  // 2. Puntajes por nodo (tú defines esto)
  const nodePoints = {
    n2: 3,
    n4: 7,
    n7: 4,
    n9: 12,
    n12: 5,
    n14: 7,
    n16: 20,
    n18: 9,
    n20: 30,
    n22: 11
  };

  const nodeBuildings = {
  n2: "house",
  n4: "castle",
  n7: "house",
  n9: "castle",
  n12: "house",
  n14: "house",
  n16: "castle",
  n18: "house",
  n20: "castle",
  n22: "house"
};


  // Activación (por ahora activamos todo)
  const nodes = activateNodes(
  rawNodes,
  ["n2","n4","n7","n9","n12","n14","n16","n18","n22","n20"],
  nodePoints,
  nodeBuildings
);



  const edges = activateEdges(rawEdges, [
  "e1", "e2", "e3", "e7", "e8", "e9", "e12", "e13", "e14", "e15", "e17", "e18", "e19", "e20", "e22", "e24", "e25", "e23"
  ]);

  // Estado inicial del juego
  edges.find(e => e.id === "e1").built = true;
  edges.find(e => e.id === "e1").available = false;
  edges.find(e => e.id === "e1").points = 0;

  // e2 está disponible para comprar
  edges.find(e => e.id === "e2").available = true;

  // n2 está disponible para comprar
  nodes.find(n => n.id === "n2").available = true;

  function buyEdge(edgeId) {
  const edge = edges.find(e => e.id === edgeId);

  if (!edge.available || edge.built) return;

  edge.built = true;

  // desbloquear caminos conectados
  const connected = edges.filter(e =>
    !e.built &&
    !e.available &&
    (e.from === edge.to || e.to === edge.to || e.from === edge.from || e.to === edge.from)
  );

  connected.forEach(e => e.available = true);
}

function buyNode(nodeId) {
  const node = nodes.find(n => n.id === nodeId);

  if (!node.available || node.built) return;

  node.built = true;
}


</script>
<div class="board-container">
  <svg 
    viewBox="0 0 800 800"
    preserveAspectRatio="xMidYMid meet"
    class="board-svg"
  >
    
  
    <!-- Hexágonos -->
    {#each boardLayout.hexes as hex}
      <HexTile {hex} />
    {/each}
    
    <!-- Caminos -->
    {#each edges as edge}
      {#if edge.active}
        <Edge {edge} nodes={nodes} onBuy={buyEdge} />
      {/if}
    {/each}
    
     <!-- Nodos -->
    {#each nodes as node}
      {#if node.active}
        <Node {node} onBuy={buyNode} />
      {/if}
  
    {/each}
  </svg>
</div>

<style>
svg {
  background: #f0e8d8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.board-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* evita que se salga del panel */
}

.board-svg {
  width: 100%;
  height: auto;
  max-height: 100%;
  min-height: 400px;
  display: block;
}

</style>
