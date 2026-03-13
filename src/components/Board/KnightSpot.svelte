<script>
  import KnightIcon from "../../icons/Knight.svelte";
  export let buyKnight;
  export let k;


  // Colores según estado
  $: fillColor = k.built
    ? "#4CAF50"      // verde (comprado)
    : k.available
      ? "#FFA726"    // naranja (disponible)
      : "#BDBDBD";   // gris (bloqueado)
</script>
 
<g 
  transform="translate({k.x}, {k.y})" 
  class="knight"
  style="cursor: {k.available ? 'pointer' : 'default'}"
  on:click={() => buyKnight(k)}
  on:click={() => {
  console.log("Knight:", k);
  buyKnight(k);
}}

  >

  <!-- Icono real del caballero -->
  <g transform="translate(-30, -50)">
    <KnightIcon 
      size={60}
      color={fillColor}
      style="stroke:black;"
      
    />
  </g>

  <!-- Puntaje siempre visible -->
   <circle 
    cx="0"
    cy="10"
    r="25" 
    fill=white 
    stroke="black" 
    stroke-width="2"
  />
  <text 
    x="0" 
    y="20" 
    text-anchor="middle" 
    font-size="26" 
    font-weight="bold"
    fill="black"
  >
    {k.points}
  </text>

</g>

<style>
  
</style>
