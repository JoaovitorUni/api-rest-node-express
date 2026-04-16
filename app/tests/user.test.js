import { vi } from 'vitest';
import bcrypt from 'bcrypt';
import { getRoot, getUsuarios, getUsuarioById, createUsuario, deleteUsuario, updateUsuario } from '../handlers/handlers.js';
import { db } from '../utils/db.js';

vi.mock('../utils/db.js', () => ({
  db: {
    prepare: vi.fn()
  }
}));
vi.mock('bcrypt', () => ({
  default: { hash: vi.fn().mockResolvedValue('hashed_password') }
}));

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe('Handlers de Usuários', () => {
  afterEach(() => vi.clearAllMocks());

  it('getRoot: deve retornar info da API', () => {
    const res = mockRes();
    getRoot({}, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ nome: 'User API' }));
  });

  it('getUsuarios: deve listar usuários', () => {
    const res = mockRes();
    const mockData = [{ id: 1, nome: 'Teste' }];
    db.prepare.mockReturnValue({ all: vi.fn().mockReturnValue(mockData) });

    getUsuarios({ query: {} }, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('createUsuario: deve criar novo usuário', async () => {
    const req = { body: { nome: 'Teste', senha: '123', cargo: 'Dev', idade: 25 } };
    const res = mockRes();
    db.prepare.mockReturnValue({ run: vi.fn().mockReturnValue({ lastInsertRowid: 10 }) });

    await createUsuario(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 10, nome: 'Teste' }));
  });

  it('updateUsuario: deve atualizar um usuário existente', async () => {
    const req = {
      params: { id: '1' },
      body: { nome: 'Nome Atualizado', senha: 'nova_senha' }
    };
    const res = mockRes();
    const mockUser = { id: 1, nome: 'Antigo', senha: 'old_hash', cargo: 'Dev', idade: 25, is_active: 1 };

    const mockGet = vi.fn().mockReturnValue(mockUser);
    const mockRun = vi.fn().mockReturnValue({ changes: 1 });
    db.prepare.mockReturnValue({ get: mockGet, run: mockRun });

    await updateUsuario(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('nova_senha', 10);

    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nome: 'Nome Atualizado',
      cargo: 'Dev',
      idade: 25,
      is_active: 1
    });
  });

  it('updateUsuario: deve retornar 404 se usuário não existir', async () => {
    const req = { params: { id: '99' }, body: { nome: 'Fantasma' } };
    const res = mockRes();
    db.prepare.mockReturnValue({ get: vi.fn().mockReturnValue(undefined) });

    await updateUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado." });
  });

  it('deleteUsuario: deve deletar um usuário existente e retornar 204', () => {
    const req = { params: { id: '1' } };
    const res = mockRes();

    db.prepare.mockReturnValue({ run: vi.fn().mockReturnValue({ changes: 1 }) });

    deleteUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteUsuario: deve retornar 404 se tentar deletar usuário inexistente', () => {
    const req = { params: { id: '99' } };
    const res = mockRes();

    db.prepare.mockReturnValue({ run: vi.fn().mockReturnValue({ changes: 0 }) });

    deleteUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado." });
  });
});