import { writable } from "svelte/store";

export const buildStore = writable({
  roads: 0,
  houses: 0,
  castles: 0,
  knights: 0
});
