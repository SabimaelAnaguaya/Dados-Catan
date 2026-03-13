<script>
  import { diceStore } from "../state/diceStore.js";
  import { buildStore } from "../state/buildStore.js";
  import { BuildLogic } from "../logic/BuildLogic.js";

  import Road from "../icons/Road.svelte";
  import House from "../icons/House.svelte";
  import Castle from "../icons/Castle.svelte";
  import Knight from "../icons/Knight.svelte";

  import Madera from "../icons/Madera.svelte";
  import Ladrillo from "../icons/Ladrillo.svelte";
  import Oveja from "../icons/Oveja.svelte";
  import Trigo from "../icons/Trigo.svelte";
  import Piedra from "../icons/Piedra.svelte";

  const icons = {
    madera: Madera,
    ladrillo: Ladrillo,
    oveja: Oveja,
    trigo: Trigo,
    piedra: Piedra
  };
  let state;
  $: diceStore.subscribe(s => state = s);

  function materiales() {
    return state.saved.reduce((acc, mat) => {
      acc[mat] = (acc[mat] || 0) + 1;
      return acc;
    }, {});
  }

  let modalTipo = null;
  function abrirModal(tipo) {
    modalTipo = tipo;
  }

  function cerrarModal() {
    modalTipo = null;
  }


 
</script>

<div class="build-panel">
  <button 
    class:desactivado={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "road")}
    on:click={() => abrirModal("road")}
  >
  <Road style="color: white" />
  </button>

  <button 
    class:desactivado={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "house")}
    on:click={() => abrirModal("house")} 
  >
      <House style="color: black" />
      
  </button>
    
  <button 
    class:desactivado={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "castle")}
    on:click={() => abrirModal("castle")} 
  >
    <Castle style="color: black"/>
  </button>
  
  <button 
    class:desactivado={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "knight")}
    on:click={() => abrirModal("knight")} 
  >
    <Knight style="color: black"/>
  </button>
</div>

{#if modalTipo}
  <div class="modal-backdrop" on:click={cerrarModal}></div>

  <div class="modal">
    <div class="req-section">

      {#each Object.entries(BuildLogic.costs[modalTipo]) as [mat, cant]}
        <div class="req">
          {#each Array(cant) as _}
            {#if icons[mat]}
              <svelte:component this={icons[mat]} size={28} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>

  </div>
{/if}


<style>
.build-panel {
  height: 50px;
  display: flex;
  flex-direction: row;  
  justify-content: space-around;
  padding: 5px;
  background: #faf7f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

}

button {
  max-width: 60px;    /* límite superior */
  aspect-ratio: 1/1;  /* ⭐ siempre cuadrados */
  
  border-radius: 10px;
  background: #d08f30;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}


.desactivado {
  background: white;
  opacity: 0.4;
  filter: grayscale(1);
}


/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  min-width: 20px;
}

.req-section {
  width: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
}




@media (min-width: 1023px) {
.build-panel {
  flex-direction: row;  
  justify-content: space-between;
}
.modal {
  
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 200px;
  height: 90px;
}

.req-section {
  width: 300px;
  flex-direction: row;
}

}


</style>
