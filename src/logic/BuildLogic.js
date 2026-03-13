export const BuildLogic = {
  costs: {
    road: { madera: 1, ladrillo: 1 },
    house: { madera: 1, ladrillo: 1, oveja: 1, trigo: 1 },
    castle: { piedra: 3, trigo: 2 },
    knight: { oveja: 1, piedra: 1, trigo: 1}
  },

  puedeConstruir(materiales, tipo) {
    const costo = this.costs[tipo];
    return Object.entries(costo).every(([recurso, cantidad]) =>
      (materiales[recurso] || 0) >= cantidad
  );
},

construir(materiales, tipo) {
  const costo = this.costs[tipo];
  const nuevos = { ...materiales };
  
  for (const recurso in costo) {
    nuevos[recurso] -= costo[recurso];
  }

    return nuevos;
  }
  
};
