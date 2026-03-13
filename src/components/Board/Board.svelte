<script>
  /* -------------------------------------------------------
     IMPORTS
  ------------------------------------------------------- */
  import { boardLayout } from "../../data/boardLayout.js";
  import HexTile from "./HexTile.svelte";
  import Node from "./Node.svelte";
  import Edge from "./Edge.svelte";
  import KnightSpot from "./KnightSpot.svelte";

  import { generateNodes } from "../../logic/generateNodes.js";
  import { generateEdges } from "../../logic/generateEdges.js";
  import { activateNodes } from "../../logic/activateNodes.js";
  import { activateEdges } from "../../logic/activateEdges.js";

  import { buildStore } from "../../state/buildStore.js";
  import { diceStore } from "../../state/diceStore.js";
  import { addSpecial } from "../../state/diceStore.js";
  import { BuildLogic } from "../../logic/BuildLogic.js";

  /* -------------------------------------------------------
     EXPORTS
  ------------------------------------------------------- */
  export let puntos = 0;
  export let reiniciar = false;

  /* -------------------------------------------------------
     REINICIO DE PARTIDA
  ------------------------------------------------------- */
  $: if (reiniciar) reiniciarPartida();

  function reiniciarPartida() {
    // Reiniciar nodos
    nodes.forEach(n => {
      n.built = false;
      n.available = false;
    });

    // Reiniciar caminos
    edges.forEach(e => {
      e.built = false;
      e.available = false;
    });

    // Estado inicial
    edges.find(e => e.id === "e1").built = true;
    edges.find(e => e.id === "e1").available = false;
    edges.find(e => e.id === "e2").available = true;
    nodes.find(n => n.id === "n2").available = true;

    nodes = [...nodes];
    edges = [...edges];
  }

  /* -------------------------------------------------------
     ESTADOS (buildStore, diceStore)
  ------------------------------------------------------- */
  let buildState;
  let diceState;

  $: buildStore.subscribe(s => (buildState = s));
  $: diceStore.subscribe(s => (diceState = s));

  $: dadosNormales = diceState.saved.filter(d => typeof d === "string");
$: dadosEspeciales = diceState.saved.filter(d => typeof d === "object");


  /* -------------------------------------------------------
     GENERACIÓN DEL TABLERO
  ------------------------------------------------------- */
  const rawNodes = generateNodes(boardLayout.hexes);
  const rawEdges = generateEdges(rawNodes, boardLayout.hexes);

  // 🔥 Asignar nodos reales a cada hex
boardLayout.hexes = boardLayout.hexes.map(hex => ({
  ...hex,
  nodes: getHexNodes(hex, rawNodes)
}));


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


  // Puntos por nodo
  const nodePoints = {
    n2: 3, n4: 7, n7: 4, n9: 12, n12: 5,
    n14: 7, n16: 20, n18: 9, n20: 30, n22: 11
  };

  // Tipo de edificio por nodo
  const nodeBuildings = {
    n2: "house", n4: "castle", n7: "house", n9: "castle",
    n12: "house", n14: "house", n16: "castle",
    n18: "house", n20: "castle", n22: "house"
  };

  // Activación inicial
  let nodes = activateNodes(
    rawNodes,
    ["n2","n4","n7","n9","n12","n14","n16","n18","n22","n20"],
    nodePoints,
    nodeBuildings
  );

  let edges = activateEdges(rawEdges, [
    "e1", "e2", "e3", "e7", "e8", "e9", "e12", "e13", "e14",
    "e15", "e17", "e18", "e19", "e20", "e22", "e24", "e25", "e23"
  ]);

  // Materiales posibles
  const materiales = ["madera", "ladrillo", "trigo", "piedra", "oveja", "oro"];

  // Generar knights basados en hexágonos
  let knights = boardLayout.hexes.map((hex, index) => {
  const cx = hex.center?.x ?? 0;
  const cy = hex.center?.y ?? 0;
  

  return {
    id: "k" + (index + 1),
    hexId: hex.id,
    x: cx,
    y: cy,
    material: materiales[Math.floor(Math.random() * materiales.length)],
    points: index + 1,
    built: false,
    available: false
  };
});



  /* -------------------------------------------------------
     CONFIGURACIÓN INICIAL
  ------------------------------------------------------- */
  edges.find(e => e.id === "e1").built = true;
  edges.find(e => e.id === "e1").available = false;
  edges.find(e => e.id === "e1").points = 0;

  edges.find(e => e.id === "e2").available = true;
  nodes.find(n => n.id === "n2").available = true;

  /* -------------------------------------------------------
     LÓGICA DE COMPRA
  ------------------------------------------------------- */
  function buyEdge(edgeId) {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge.available || edge.built) return;

    edge.built = true;

    // Desbloquear caminos conectados
    edges
      .filter(e =>
        !e.built &&
        !e.available &&
        (e.from === edge.to || e.to === edge.to || e.from === edge.from || e.to === edge.from)
      )
      .forEach(e => (e.available = true));
  }

  function buyNode(nodeId) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node.available || node.built) return;
    node.built = true;
  }

  function buyKnight(knight) {
    if (!knight.available || knight.built) return;
    
    // 1. Materiales disponibles (dados guardados)
    const mats = (diceState.saved ?? []).reduce((acc, d) => {
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

  
    // 2. Verificar si se puede construir un caballero
    //    (asegúrate de definir el coste de "knight" en BuildLogic)
    if (!BuildLogic.puedeConstruir(mats, "knight")) return;
  
    // 3. Consumir materiales normales
    const nuevos = BuildLogic.construir(mats, "knight");
  
    // separar normales y especiales
    const especiales = (diceState.saved ?? []).filter(
      d => typeof d === "object" && d.type === "special"
    );
  
    const normales = Object.entries(nuevos).flatMap(([mat, cant]) =>
      Array(cant).fill(mat)
    );
  
    diceStore.update(s => ({
      ...s,
      saved: [...normales, ...especiales]
    }));
  
    // 4. Marcar caballero como construido
    knight.built = true;
  
    // 5. Dar material especial como dado permanente
    addSpecial(knight.material);
  
    // 6. Sumar puntos
    puntos += knight.points;
  
    // 7. Forzar reactividad
    knights = [...knights];
  }



  /* -------------------------------------------------------
     LÓGICA DE CONSTRUCCIÓN
  ------------------------------------------------------- */

  function intentarColocar(tipo, item) {
  if (item.built) return;
  if (!item.available) return;

  // Materiales disponibles
  const mats = (diceState.saved ?? []).reduce((acc, d) => {
  acc[d] = (acc[d] || 0) + 1;
  return acc;
  }, {});


  if (!BuildLogic.puedeConstruir(mats, tipo)) return;

  // Consumir materiales
  const nuevos = BuildLogic.construir(mats, tipo);
  diceStore.update(s => ({
    ...s,
    saved: Object.entries(nuevos).flatMap(([mat, cant]) =>
      Array(cant).fill(mat)
    )
  }));

  // Construir
  item.built = true;

  /* -------------------------------------------------------
     CABALLERO FINAL (solo se activa cuando se construye n20)
  ------------------------------------------------------- */
  if (item.id === "n20") {
    const finalKnight = knights.find(k => k.id === "k6");
    if (finalKnight && !finalKnight.built) {
      finalKnight.available = true;
      knights = [...knights];
    }
  }

  /* -------------------------
     PUNTOS
  ------------------------- */
  if (tipo === "road") {
    puntos += 1;
  } else {
    puntos += item.points;
    nodes = [...nodes];
  }

  /* -------------------------------------------------------
     REACTIVIDAD Y DESBLOQUEOS
  ------------------------------------------------------- */
  if (tipo === "road") {
    edges = [...edges];

    // Desbloquear caminos conectados
    edges
      .filter(e =>
        !e.built &&
        !e.available &&
        (e.from === item.to || e.to === item.to || e.from === item.from || e.to === item.from)
      )
      .forEach(e => (e.available = true));

    // Desbloquear nodos conectados
    nodes
      .filter(n => n.id === item.from || n.id === item.to)
      .forEach(n => {
        if (!n.built) n.available = true;
      });

    nodes = [...nodes];

    /* -------------------------------------------------------
       ACTIVAR CABALLEROS CONECTADOS POR CAMINO
       (excepto el caballero final k6)
    ------------------------------------------------------- */
    knights.forEach(k => {
      const hex = boardLayout.hexes.find(h => h.id === k.hexId);
      if (!hex) return;

      // Si el camino toca un nodo del hex del caballero
      const tocaNodoDelHex =
        hex.nodes.includes(item.from) || hex.nodes.includes(item.to);

      if (tocaNodoDelHex) {
        // Caballeros normales (1–5)
        if (!k.built && k.id !== "k6") {
          k.available = true;
        }

        // Caballero final NO se activa por caminos
        if (k.id === "k6") {
          // Buscar el edge clave
          const edgeClave = edges.find(e => e.id === "e24");

          // Activar el Knight solo si ese edge está construido
          k.available = edgeClave?.built === true;
        }



      }
    });

    knights = [...knights];
  }

  /* -------------------------------------------------------
     ACTIVAR CABALLEROS POR CONSTRUCCIÓN DE CASA/CASTILLO
     (excepto k6)
  ------------------------------------------------------- */
  if (tipo !== "road") {
    knights.forEach(k => {
      const hex = boardLayout.hexes.find(h => h.id === k.hexId);
      if (!hex) return;

      if (hex.nodes.includes(item.id)) {
        if (!k.built && k.id !== "k6") {
          k.available = true;
        }
      }
    });

    knights = [...knights];
  }
}

</script>

<!-- -------------------------------------------------------
     UI
------------------------------------------------------- -->
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
        <Edge 
          {edge} 
          nodes={nodes} 
          on:click={() => intentarColocar("road", edge)} 
        />
      {/if}
    {/each}

    <!-- Nodos -->
    {#each nodes as node}
      {#if node.active}
        <Node 
          {node} 
          on:click={() => intentarColocar(node.building, node)}
        />
      {/if}
    {/each}

    <!-- Knights -->
    {#each knights as k}
      <KnightSpot 
        {k}
        buyKnight={buyKnight}
      />
    {/each}



  </svg>
</div>

<style>
  svg {
    background: #45584d;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .board-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .board-svg {
    width: 100%;
    height: auto;
    max-height: 100%;
    min-height: 400px;
    display: block;
  }
</style>
