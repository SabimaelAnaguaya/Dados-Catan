<script>
  import Board from "./components/Board/Board.svelte";
  import DiceRoller from "./components/DiceRoller.svelte";
  import BuildPanel from "./components/BuildPanel.svelte";

  let nodes;
  let edges;
  let puntos = 0;

  let reiniciar = false;
  let mostrarModal = false;
  let puntajeFinal = 0;
  let turnosRestantes = 15;

  function handleFinPartida(event) {
    puntajeFinal = puntos;
    puntos = 0;
    turnosRestantes = event.detail.turnosRestantes;
    mostrarModal = true;

    reiniciar = true;
    setTimeout(() => reiniciar = false, 0);
  }
</script>

<!-- -------------------------------------------------------
     LAYOUT FLUIDO
------------------------------------------------------- -->
<div class="layout">

  <!-- HUD -->
  <div class="hud">
    <div class="stat">Puntos actuales: {puntos}</div>
    <div class="stat">Turnos restantes: {turnosRestantes}</div>
  </div>

  <!-- BOARD -->
  <div class="board-area">
    <Board 
      {reiniciar} 
      bind:nodes 
      bind:edges 
      bind:puntos 
    />
  </div>
  <!-- AREA DADOS & PANEL -->
  <div class="area-dados">
    <!-- DICE -->
    <div class="dice-area">
      <DiceRoller 
        bind:turnosRestantes
        on:finPartida={handleFinPartida}
      />
    </div>
  
    <!-- BUILD PANEL -->
    <div class="build-area">
      <BuildPanel {nodes} {edges} />
    </div>
  </div>

</div>


<!-- MODAL -->
{#if mostrarModal}
  <div class="modal">
    <div class="modal-content">
      <h2>¡Fin de la partida!</h2>
      <p>Puntaje obtenido: {puntajeFinal}</p>
      <button on:click={() => mostrarModal = false}>Cerrar</button>
    </div>
  </div>
{/if}

<style>
  .layout {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

/* HUD */
.hud {
  width: 100%;
  position: fixed;
  height: fit-content;
  border: 1px solid;
  display: flex;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  background-color: #fafafa;
  padding: 5px;
}

/* Board ocupa todo el espacio posible */
.board-area {
  width: 100%;
  margin: auto 0;
  margin-top: 60px; /* deja espacio para el HUD */
  display: flex;
  justify-content: center;
}


.area-dados {
  width: 100%;
  margin: auto 10%;
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  justify-content: space-between;
}


.dice-area{
  width: 100%;
}

.build-area{
  width: 100%;
  height: 40px;
}

@media (min-width: 1023px) {

  .layout {
    max-width: 1100px;
    flex-direction: row;
    justify-content: center;
    margin: 0 auto;
  }

  .board-area {
    max-width: 600px;
    margin: 10% auto;
    margin-top: 60px;
  }
  
  .area-dados {
    max-width: 400px;
    flex-direction: column-reverse;
    margin: 10% auto;
    margin-top: 60px;
  }

  .dice-area{
    width: 100%;
    height: calc(100% - 80px);
  }

  .build-area{
    max-width: 100%;
    height: 80px;
    overflow: hidden;
  }
}


</style>
