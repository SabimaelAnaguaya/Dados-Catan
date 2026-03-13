<script>
  import { materialIcons } from "../../icons/materialIcons.js";
  export let material;
  export let onUse;

  const Icon = materialIcons[material];
</script>

<div class="special-die" on:click={onUse}>
  <svelte:component this={Icon} size={26} />
</div>

<style>
  .special-die {
    min-width: 40px;
    max-width: 60px;
    aspect-ratio: 1;
    border-radius: 8px;
    background: #0099ff;
    border: 3px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4px;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(0, 153, 255, 0.8);
    transition: transform 0.15s ease;
  }

  .special-die:hover {
    transform: scale(1.1);
  }
</style>
