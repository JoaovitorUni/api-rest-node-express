import { vi } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login } from '../handlers/handlers.js';
import { db } from '../utils/db.js';

vi.mock('../utils/db.js', () => ({
  db: {
    prepare: vi.fn()
  }
}));
vi.mock('bcrypt', () => ({
  default: { compare: vi.fn() }
}));
vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn() }
}));

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Handler de Autenticação', () => {
  afterEach(() => vi.clearAllMocks());

  it('login: deve retornar erro 401 para credenciais inválidas', async () => {
    const req = { body: { nome: 'admin', senha: '123' } };
    const res = mockRes();

    db.prepare.mockReturnValue({ get: vi.fn().mockReturnValue(null) });

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário ou senha inválidos." });
  });

  it('login: deve retornar token quando a senha está correta', async () => {
    const req = { body: { nome: 'admin', senha: '123' } };
    const res = mockRes();
    const mockUser = { id: 1, nome: 'admin', senha: 'hash', cargo: 'admin' };

    const mockGet = vi.fn().mockReturnValue(mockUser);
    db.prepare.mockReturnValue({ get: mockGet }); 
    
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token_gerado');

    await login(req, res);
    expect(res.json).toHaveBeenCalledWith({ auth: true, token: 'token_gerado' });
  });
});