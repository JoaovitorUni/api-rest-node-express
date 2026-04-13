import bcrypt from 'bcrypt';
import { db } from '../utils/db.js';

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
  
  let sql = 'SELECT * FROM users WHERE 1=1';
  const params = [];

  if (cargo) {
    sql += ' AND cargo LIKE ?';
    params.push(`%${cargo}%`);
  }
  if (idade_max) {
    sql += ' AND idade <= ?';
    params.push(parseInt(idade_max));
  }
  if (idade_min) {
    sql += ' AND idade >= ?';
    params.push(parseInt(idade_min));
  }

  const allowedOrderFields = ['nome', 'idade', 'id'];
  const sortField = allowedOrderFields.includes(ordem) ? ordem : 'id';
  const sortDirection = direcao === 'desc' ? 'DESC' : 'ASC';
  
  sql += ` ORDER BY ${sortField} ${sortDirection}`;

  try {
    const usuarios = db.prepare(sql).all(...params);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários no banco de dados." });
  }
};

export const getUsuarioById = (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    const usuario = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

export const createUsuario = async (req, res) => {
  const { nome, senha, cargo, idade, ativo } = req.body;

  if (!nome || !senha || !cargo || !idade) {
    return res.status(400).json({ error: "Nome, senha, cargo e idade são obrigatórios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const is_active = ativo !== undefined ? (ativo ? 1 : 0) : 1;
    const info = db.prepare('INSERT INTO users (nome, senha, cargo, idade, is_active) VALUES (?, ?, ?, ?, ?)').run(
      nome,
      hashedPassword,
      cargo,
      parseInt(idade),
      is_active
    );
    
    const novoUsuario = {
      id: info.lastInsertRowid,
      nome,
      cargo,
      idade,
      is_active
    };

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

export const updateUsuario = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, senha, cargo, idade, ativo } = req.body;

  try {
    const usuario = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const updatedNome = nome || usuario.nome;
    const updatedPassword = senha ? await bcrypt.hash(senha, 10) : usuario.senha;
    const updatedCargo = cargo || usuario.cargo;
    const updatedIdade = idade !== undefined ? parseInt(idade) : usuario.idade;
    const updatedAtivo = ativo !== undefined ? (ativo ? 1 : 0) : usuario.is_active;

    db.prepare(`
      UPDATE users 
      SET nome = ?, senha = ?, cargo = ?, idade = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(updatedNome, updatedPassword, updatedCargo, updatedIdade, updatedAtivo, id);

    res.json({
      id,
      nome: updatedNome,
      cargo: updatedCargo,
      idade: updatedIdade,
      is_active: updatedAtivo
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

export const deleteUsuario = (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário." });
  }
};
