<script>

  export let turnosRestantes = 15;

  /* -------------------------------------------------------
     IMPORTS
  ------------------------------------------------------- */
  import { createEventDispatcher } from "svelte";
  import { 
    diceStore, 
    toggleSave, 
    toggleUnsave, 
    rollDice, 
    finalizarTurno 
  } from "../state/diceStore.js";

  import { GameLogic } from "../logic/GameLogic.js";
  import Dice from "./Dice.svelte";
  import ShopModal from "./ShopModal.svelte";

  import SpecialDie from "./dice/SpecialDie.svelte";
  import { useSpecial } from "../state/diceStore.js";


  const dispatch = createEventDispatcher();

  /* -------------------------------------------------------
     ESTADO LOCAL
  ------------------------------------------------------- */
  let state;
  let shopOpen = false;

  diceStore.subscribe(s => state = s);
  $: dadosEspeciales = state.specials;
  $: dadosNormales = state.saved;

  



  /* -------------------------------------------------------
     CONTROL DE TURNOS
  ------------------------------------------------------- */
  let turnos = 1;
  const MAX_TURNOS = 15;

  // Reactivo: turnos restantes
  $: turnosRestantes =
    turnos <= MAX_TURNOS
      ? MAX_TURNOS - turnos + 1
      : 0;

  /* -------------------------------------------------------
     ACCIONES DEL JUGADOR
  ------------------------------------------------------- */
  function confirmarResultado() {
    finalizarTurno();
  }

  function moverEspecialAGuardados(material) {
  diceStore.update(state => {
    // Quitar el especial de su sección
    const restantes = state.saved.filter(
      d => !(typeof d === "object" && d.material === material)
    );

    // Agregarlo como dado normal
    return {
      ...state,
      saved: [...restantes, material]
    };
  });
}

function iniciarNuevoTurno() {
  diceStore.update(state => ({
    active: ["?", "?", "?", "?", "?", "?"],
    saved: [],            // normales se borran
    specials: state.specials, // especiales se conservan
    rollsLeft: 3,
    turnoFinalizado: false
  }));

  turnos += 1;

  if (turnos > MAX_TURNOS) {
    dispatch("finPartida", { turnosRestantes });
    turnos = 1;
    return;
  }
}

  

    
</script>


<!-- -------------------------------------------------------
     UI
------------------------------------------------------- -->
<div class="dice-roller">

  <!-- BLOQUE PRINCIPAL -->
  <div class="grupo-principal">
    <div class="grupo-dados">

      
      <div class="row activos">
        {#each state.active as d, i}
          <Dice value={d} onClick={() => toggleSave(i)} />
        {/each}
      </div>
  
      <div class="row guardados">
        {#each dadosNormales as d, i}
          <Dice value={d} onClick={() => toggleUnsave(i)} />
        {/each}
      </div>
    </div>

    <div class="buttons">
      {#if !state.turnoFinalizado}
        <button on:click={rollDice} disabled={state.rollsLeft === 0}>
          Tirar ({state.rollsLeft}/3)
        </button>
      {:else}
        <button class="next-turn" on:click={iniciarNuevoTurno}>
          Siguiente turno
        </button>
      {/if}

      <button 
        on:click={() => {
          const pares = GameLogic.paresDeOro([...state.saved]);
          if (pares === 0) confirmarResultado();
          else shopOpen = true;
        }}
        disabled={state.rollsLeft !== 0 || state.turnoFinalizado}
      >
        {GameLogic.paresDeOro([...state.saved]) === 0 
          ? "Confirmar" 
          : "🛒 Tienda"}
      </button>
    </div>

  </div>

  <!-- BLOQUE ESPECIALES (sin título) -->
  <div class="grupo-especiales">
    <div class="col-especiales">
      {#each dadosEspeciales as d}
        <SpecialDie 
          material={d.material}
          onUse={() => useSpecial(d.material)}
        />
      {/each}
    </div>
  </div>

</div>




<!-- -------------------------------------------------------
     MODAL DE TIENDA
------------------------------------------------------- -->
{#if shopOpen}
  <ShopModal 
    on:close={() => shopOpen = false}
    on:confirm={() => {
      shopOpen = false;
      confirmarResultado();
    }}
  />
{/if}


<!-- -------------------------------------------------------
     ESTILOS
------------------------------------------------------- -->
<style>

.dice-roller {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  height: 100%;
}

/* ############################################# */
/* ############################################# */
/* ############################################# */
.grupo-principal {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: calc(100% - 60px);
  background-color: #faf7f0;
  
}

.grupo-especiales {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: #faf7f0;
  border-radius: 12px;
  width: 60px;
}
/* ############################################## */
/* ############################################## */
/* ############################################## */

.grupo-dados{
  display: grid;
  grid-template-columns: 1fr 1fr; /* activos | guardados */
  align-items: start;
  height: 100%;
  min-height: 250px;
}

.grupo-dados .activos, .grupo-dados .guardados {
  background-color: #45584d;
  padding: 10px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 6px;
  justify-items: center;
  align-items: center;

  height: 100%;
  border-radius: 8px;
}

.grupo-dados .guardados{
  background-color: #896b49;
}

/* botones */
.buttons {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
}

.buttons button{
  width: 100%;
}

@media (min-width: 1023px) {
  .dice-roller {
    flex-direction: column;
    justify-content: space-between;
  }
  .grupo-principal {
   flex-direction: column;
   width: 100%;
   height: 100%;
   
  }

  .grupo-especiales {
   flex-direction: row;
   width: 100%;
    justify-content: center;
  }

  .grupo-dados .activos, .grupo-dados .guardados {
  
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  
}
}

</style>
