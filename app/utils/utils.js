function orderLogic(a, b, ordem, direcao) {
  if (ordem === 'idade') {
    return direcao === 'desc' 
      ? b.idade - a.idade 
      : a.idade - b.idade;
  }

  if (ordem === 'nome') {
    return direcao === 'desc'
      ? b.nome.localeCompare(a.nome)
      : a.nome.localeCompare(b.nome);
  }
}

export { orderLogic };