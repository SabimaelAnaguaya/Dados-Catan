export const GameLogic = {
  contarOro(dados) {
    return dados.filter(v => v === "oro").length;
  },

  paresDeOro(dados) {
    return Math.floor(this.contarOro(dados) / 2);
  },

  convertirUnPar(dados, recurso) {
    let orosPorQuitar = 2;
    const resultado = [];

    for (const d of dados) {
      if (d === "oro" && orosPorQuitar > 0) {
        orosPorQuitar--;
      } else {
        resultado.push(d);
      }
    }

    resultado.push(recurso);
    return resultado;
  }
};
