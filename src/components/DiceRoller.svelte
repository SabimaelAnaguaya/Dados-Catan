<script>
  import { diceStore, toggleSave, toggleUnsave, rollDice } from "../state/diceStore.js";
  import { GameLogic } from "../logic/GameLogic.js";
  import Dice from "./Dice.svelte";
  import ShopModal from "./ShopModal.svelte";

  let state;
  let shopOpen = false;

  $: diceStore.subscribe(s => state = s);

  import { finalizarTurno } from "../state/diceStore.js";

function confirmarResultado() {
  finalizarTurno();
}

function iniciarNuevoTurno() {
  diceStore.update(state => ({
    active: ["?", "?", "?", "?", "?", "?"], 
    saved: [],
    rollsLeft: 3,
    turnoFinalizado: false
  }));
}


</script>
<div class="section">

    
    <h3>Dados activos</h3>
    <div class="row">
      {#each state.active as d, i}
        <Dice value={d} onClick={() => toggleSave(i)} />
      {/each}
    </div>
    
    <h3>Dados guardados</h3>
    <div class="row">
      {#each state.saved as d, i}
        <Dice value={d} onClick={() => toggleUnsave(i)} />
      {/each}
    </div>
    
    <div class="buttons">
      <!-- BOTÓN PRINCIPAL -->
      {#if !state.turnoFinalizado}
        <button 
          on:click={rollDice} 
          disabled={state.rollsLeft === 0}
        >
          Tirar ({state.rollsLeft}/3)
        </button>
      {:else}
        <button 
          class="next-turn"
          on:click={iniciarNuevoTurno}
        >
          Siguiente turno
        </button>
      {/if}
    
      <!-- BOTÓN TIENDA / CONFIRMAR -->
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

{#if shopOpen}
  <ShopModal 
  on:close={() => {
    shopOpen = false; // solo cerrar
  }}

  on:confirm={() => {
    shopOpen = false;
    confirmarResultado(); // aquí sí finaliza turno
  }}
/>


{/if}



<style>
.section {
  background: #faf7f0;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.next-turn {
  background: #4caf50;
  color: white;
  font-weight: bold;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.next-turn:hover {
  background: #43a047;
  transform: translateY(-2px);
}

</style>
