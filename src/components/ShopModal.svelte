<script>
  import Madera from "../icons/Madera.svelte";
  import Oveja from "../icons/Oveja.svelte";
  import Piedra from "../icons/Piedra.svelte";
  import Ladrillo from "../icons/Ladrillo.svelte";
  import Trigo from "../icons/Trigo.svelte";

  import { diceStore, setAll } from "../state/diceStore.js";
  import { GameLogic } from "../logic/GameLogic.js";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  
  let autoCloseEnabled = true;
  
  function handleOverlayClick() {
    autoCloseEnabled = false;  // evita autocierre inmediato
    dispatch("close");
  }


  let state;
  $: diceStore.subscribe(s => state = s);

  function elegir(recurso) {
    const nuevos = GameLogic.convertirUnPar([...state.active, ...state.saved], recurso);
    setAll(nuevos);
  }

  $: if (autoCloseEnabled && GameLogic.paresDeOro([...state.saved]) === 0) {
    dispatch("confirm");
  }



</script>

<div class="overlay" on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <h3>Convertir Oro</h3>

    <p>Tienes {GameLogic.paresDeOro([...state.saved])} conversiones disponibles</p>

    <div class="options">
      <button on:click={() => elegir("madera")}><Madera /></button>
      <button on:click={() => elegir("piedra")}><Piedra /></button>
      <button on:click={() => elegir("oveja")}><Oveja /></button>
      <button on:click={() => elegir("ladrillo")}><Ladrillo /></button>
      <button on:click={() => elegir("trigo")}><Trigo /></button>
    </div>

    <button class="confirm" on:click={() => dispatch("confirm")}>
      Confirmar
    </button>
  </div>
</div>

<style>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  min-width: 300px;
  animation: pop 0.25s ease;
}


@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}


.options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.confirm {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  background: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
