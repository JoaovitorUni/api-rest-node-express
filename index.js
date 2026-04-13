import express from 'express';
import jwt from 'jsonwebtoken';
import { loadEnvFile } from 'node:process';
import { getRoot, getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, login } from './app/handlers/handlers.js';
import { db, migrate, populate } from './app/utils/db.js';

loadEnvFile();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const app = express();
const port = process.env.PORT || 3000;

migrate(db);
populate(db);

const logMiddleware = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.path} - ${req.method}`);
  next();
}
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Acesso negado." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Token Inválido. Não foi possível validar seu token." });
  }
};
app.use(express.json());
app.use(logMiddleware);

app.get('/', getRoot);
app.get('/api/usuarios', getUsuarios);
app.get('/api/usuarios/:id', getUsuarioById);
app.post('/api/usuarios', createUsuario);
app.put('/api/usuarios/:id', updateUsuario);
app.delete('/api/usuarios/:id', deleteUsuario);

app.post('/api/login', login);

app.use(authMiddleware);
app.get('/api/auth/example', (req, res) => {
  res.json(req.user);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
