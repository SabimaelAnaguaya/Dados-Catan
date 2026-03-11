<script>
  export let value;
  export let onClick = () => {};

  import Madera from "../icons/Madera.svelte";
  import Oro from "../icons/Oro.svelte";
  import Oveja from "../icons/Oveja.svelte";
  import Piedra from "../icons/Piedra.svelte";
  import Ladrillo from "../icons/Ladrillo.svelte";
  import Trigo from "../icons/Trigo.svelte";
</script>

<button class="die" on:click={value !== "?" ? onClick : null} disabled={value === "?"} aria-label="dado">
  {#if value === "madera"}
    <Madera  />
  {:else if value === "oro"}
    <Oro  />
  {:else if value === "oveja"}
    <Oveja  />
  {:else if value === "piedra"}
    <Piedra  />
  {:else if value === "ladrillo"}
    <Ladrillo  />
  {:else if value === "trigo"}
    <Trigo  />
  {:else}
    ?
  {/if}
</button>


<style>
.die {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.die:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(0,0,0,0.25);
}


</style>
