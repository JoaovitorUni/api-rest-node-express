import { orderLogic } from '../utils/utils.js';

// Mock de Usuários
export const usuarios = [
  { id: 1, nome: "Alice Silva", idade: 28, cargo: "Desenvolvedora", ativo: true },
  { id: 2, nome: "Bruno Costa", idade: 34, cargo: "Designer", ativo: false },
  { id: 3, nome: "Carla Souza", idade: 22, cargo: "Desenvolvedora", ativo: true },
  { id: 4, nome: "Daniel Oliveira", idade: 40, cargo: "Gerente", ativo: true }
];

export const getRoot = (req, res) => {
  res.json({
    nome: 'User API',
    versao: '1.0.0',
    autor: "João Vitor",
    descricao: "Listagem e filtragem de usuários."
  });
};

export const getUsuarios = (req, res) => {
  const { cargo, idade_max, idade_min, ordem, direcao } = req.query;
  let resultado = [...usuarios];

  if (ordem) {
    resultado.sort((a, b) => orderLogic(a, b, ordem, direcao));
  }

  if (cargo) {
    resultado = resultado.filter(u => u.cargo.toLowerCase() === cargo.toLowerCase());
  }
  if (idade_max) {
    resultado = resultado.filter(u => u.idade <= parseInt(idade_max));
  }
  if (idade_min) {
    resultado = resultado.filter(u => u.idade >= parseInt(idade_min));
  }

  res.json(resultado);
};

export const getUsuarioById = (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }
  
  res.json(usuario);
};
