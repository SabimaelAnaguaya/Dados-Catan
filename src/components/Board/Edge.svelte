<script>
  export let edge;
  export let nodes;
  export let onBuy;

  const from = nodes.find(n => n.id === edge.from);
  const to = nodes.find(n => n.id === edge.to);

  $: strokeColor =
    edge.built ? "#2ecc71" :        // verde
    edge.available ? "#e67e22" :    // naranja
    "#cccccc";                      // gris

  $: strokeWidth =
    edge.built ? 8 :
    edge.available ? 6 :
    4;

  $: opacity =
    edge.built ? 1 :
    edge.available ? 0.9 :
    0.4;
</script>

<line
  x1={from.x}
  y1={from.y}
  x2={to.x}
  y2={to.y}
  stroke={strokeColor}
  stroke-width={strokeWidth}
  opacity={opacity}
  stroke-linecap="round"
  on:click={() => onBuy(edge.id)}
/>
