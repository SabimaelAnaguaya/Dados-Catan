import { writable } from "svelte/store";

export const diceStore = writable({
  active: ["?", "?", "?", "?", "?", "?"],
  saved: [],
  specials: [],
  rollsLeft: 3,
  turnoFinalizado: false
});

/* -------------------------------------------------------
   FINALIZAR TURNO
------------------------------------------------------- */
export function finalizarTurno() {
  diceStore.update(state => ({
    ...state,
    turnoFinalizado: true
  }));
}

/* -------------------------------------------------------
   GUARDAR DADO NORMAL
   (los especiales NO se pueden guardar)
------------------------------------------------------- */
export function toggleSave(index) {
  diceStore.update(state => {
    if (state.rollsLeft === 3) return state;

    const dado = state.active[index];

    // No permitir guardar dados especiales
    if (typeof dado === "object") return state;

    state.active.splice(index, 1);
    state.saved.push(dado);

    return state;
  });
}

/* -------------------------------------------------------
   DESGUARDAR DADO NORMAL
   (los especiales NO se pueden desguardar)
------------------------------------------------------- */
export function toggleUnsave(index) {
  diceStore.update(state => {
    if (state.rollsLeft === 3) return state;

    const dado = state.saved[index];

    // No permitir desguardar dados especiales
    if (typeof dado === "object") return state;

    state.saved.splice(index, 1);
    state.active.push(dado);

    return state;
  });
}

/* -------------------------------------------------------
   SET ALL (para cuando ya no quedan tiradas)
------------------------------------------------------- */
export function setAll(newDiceArray) {
  diceStore.update(state => {
    return {
      ...state,
      active: [],
      saved: newDiceArray,
      rollsLeft: 0
    };
  });
}

/* -------------------------------------------------------
   TIRAR DADOS
   - Solo tira los normales
   - Los especiales permanecen en saved
------------------------------------------------------- */
export function rollDice() {
  diceStore.update(state => {
    if (state.rollsLeft <= 0) return state;

    const caras = ["madera", "piedra", "oro", "oveja", "ladrillo", "trigo"];

    // Tirar solo los dados normales
    state.active = state.active.map(d =>
      typeof d === "string"
        ? caras[Math.floor(Math.random() * caras.length)]
        : d // si fuera especial (no debería), no se cambia
    );

    state.rollsLeft--;

    // Si ya no quedan tiradas, mover solo los normales a saved
    if (state.rollsLeft === 0) {
      const normales = state.active.filter(d => typeof d === "string");
      state.saved = [...state.saved, ...normales];
      state.active = [];
    }

    return state;
  });
}

/* -------------------------------------------------------
   AÑADIR MATERIAL ESPECIAL PERMANENTE
   (para caballeros o hexágonos)
------------------------------------------------------- */
export function addSpecial(material) {
  diceStore.update(state => ({
    ...state,
    specials: [...state.specials, { material }]
  }));
}

/* -------------------------------------------------------
   CONSUMIR MATERIAL ESPECIAL
   (cuando el jugador lo usa)
------------------------------------------------------- */
export function useSpecial(material) {
  diceStore.update(state => {
    let removed = false;

    // quitar el primer especial del material
    const nuevosEspeciales = state.specials.filter(s => {
      if (!removed && s.material === material) {
        removed = true;
        return false;
      }
      return true;
    });

    // agregar un dado normal a saved
    const nuevosSaved = [...state.saved, material];

    return {
      ...state,
      specials: nuevosEspeciales,
      saved: nuevosSaved
    };
  });
}



