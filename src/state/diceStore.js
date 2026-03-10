import { writable } from "svelte/store";

export const diceStore = writable({
  active: ["?", "?", "?", "?", "?", "?"],
  saved: [],
  rollsLeft: 3,
  turnoFinalizado: false
});

export function finalizarTurno() {
  diceStore.update(state => ({
    ...state,
    turnoFinalizado: true
  }));
}


export function toggleSave(index) {
  diceStore.update(state => {
    // No permitir guardar antes de la primera tirada
    if (state.rollsLeft === 3) return state;

    const dado = state.active[index];

    state.active.splice(index, 1);
    state.saved.push(dado);

    return state;
  });
}


export function toggleUnsave(index) {
  diceStore.update(state => {
    // No permitir desguardar antes de la primera tirada
    if (state.rollsLeft === 3) return state;

    const dado = state.saved[index];

    state.saved.splice(index, 1);
    state.active.push(dado);

    return state;
  });
}
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


export function rollDice() {
  diceStore.update(state => {
    if (state.rollsLeft <= 0) return state;

    const caras = ["madera", "piedra", "oro", "oveja", "ladrillo", "trigo"];

    // Tirar solo los dados activos
    state.active = state.active.map(() =>
      caras[Math.floor(Math.random() * caras.length)]
    );

    state.rollsLeft--;

    // ⭐ Si ya no quedan tiradas, mover todo a saved
    if (state.rollsLeft === 0) {
      state.saved = [...state.saved, ...state.active];
      state.active = [];
    }

    return state;
  });



}


