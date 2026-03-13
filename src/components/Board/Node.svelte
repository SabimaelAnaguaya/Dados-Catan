<script>
  import { createEventDispatcher } from "svelte";

  export let node;

  import House from "../../icons/House.svelte";
  import Castle from "../../icons/Castle.svelte";

  const dispatch = createEventDispatcher();

  $: iconColor =
    node.built ? "#2ecc71" :
    node.available ? "#e67e22" :
    "#999999";

  function handleClick(event) {
    event.stopPropagation();
    dispatch("click", { node });
  }
</script>

{#if node.active}
  <g 
    on:click={handleClick}
    transform="translate({node.x - 25}, {node.y - 45})"
    style="color: {iconColor}"
    class:resaltado={node.available}
  >
    
    {#if node.building === "house"}
      <House />
    {:else if node.building === "castle"}
      <Castle />
    {:else}
      <!-- Nodo vacío -->
      <circle 
        cx="10" cy="10" r="10"
        fill="white"
        stroke="black"
        stroke-width="2"
      />
    {/if}

  </g>

  <!-- Puntaje del nodo -->
  <g transform="translate({node.x}, {node.y - 35})">
    <circle 
      cx="0" 
      cy="0" 
      r="14"
      fill="white"
      stroke="black"
      stroke-width="3"
    />

    <text 
      x="0"
      y="8"
      font-size="20"
      text-anchor="middle"
      fill="black"
      font-weight="bold"
    >
      {node.points}
    </text>
  </g>
{/if}

<style>
  .resaltado {
    filter: drop-shadow(0 0 6px gold);
    cursor: pointer;
  }
</style>
