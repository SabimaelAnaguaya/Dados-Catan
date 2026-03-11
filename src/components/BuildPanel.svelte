<script>
  import { diceStore } from "../state/diceStore.js";
  import { buildStore } from "../state/buildStore.js";
  import { BuildLogic } from "../logic/BuildLogic.js";

  import Road from "../icons/Road.svelte";
  import House from "../icons/House.svelte";
  import Castle from "../icons/Castle.svelte";
  import Knight from "../icons/Knight.svelte";

  let state;
  $: diceStore.subscribe(s => state = s);

  function materiales() {
    return state.saved.reduce((acc, mat) => {
      acc[mat] = (acc[mat] || 0) + 1;
      return acc;
    }, {});
  }

  function intentarConstruir(tipo) {
    const mats = materiales();

    if (!BuildLogic.puedeConstruir(mats, tipo)) return;

    const nuevos = BuildLogic.construir(mats, tipo);

    // actualizar dados
    diceStore.update(s => ({
      ...s,
      saved: Object.entries(nuevos).flatMap(([mat, cant]) =>
        Array(cant).fill(mat)
      )
    }));

    // actualizar construcciones
    buildStore.update(b => ({
      ...b,
      [tipo + "s"]: b[tipo + "s"] + 1
    }));
  }
  
 
</script>

<div class="build-panel">
  <button 
    disabled={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "road")}
    on:click={() => intentarConstruir("road")}
  >

    <Road style="color: white" />
  </button>

  <button 
    disabled={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "house")}
    on:click={() => intentarConstruir("house")}
  >
      <House style="color: black" />
    
  </button>

  <button 
    disabled={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "castle")}
    on:click={() => intentarConstruir("castle")}
  >
    <Castle style="color: black"/>
  </button>

  <button 
    disabled={state.rollsLeft > 0 || !BuildLogic.puedeConstruir(materiales(), "knight")}
    on:click={() => intentarConstruir("knight")}
  >
    <Knight style="color: black"/>
  </button>
</div>

<style>
.build-panel {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: #faf7f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
button {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background: white;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
