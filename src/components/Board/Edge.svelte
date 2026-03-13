<script>


import { createEventDispatcher } from "svelte";
import { buildStore } from "../../state/buildStore.js";

let buildState;
$: buildStore.subscribe(s => buildState = s);

export let edge;
export let nodes;

  const dispatch = createEventDispatcher();

  $: from = nodes.find(n => n.id === edge.from);
  $: to = nodes.find(n => n.id === edge.to);

  $: strokeColor =
    edge.built ? "#2ecc71" :
    edge.available ? "#e67e22" :
    "black";

  $: strokeWidth =
    edge.built ? 8 :
    edge.available ? 6 :
    7;

  $: opacity =
    edge.built ? 1 :
    edge.available ? 0.9 :
    0.4;

  function handleClick(event) {
    event.stopPropagation();
    dispatch("click", { edge });
  }
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
  on:click={handleClick}
  class:resaltado={buildState.modoConstruccion === "road" && edge.available}
  

/>

<style>
  line{
    cursor: pointer;
  }

  .resaltado {
    filter: drop-shadow(0 0 6px gold);
  }
</style>
