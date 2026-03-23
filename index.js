import express from 'express';
import Database from 'better-sqlite3';
import { getRoot, getUsuarios, getUsuarioById } from './app/handlers/handlers.js';
import { migrate, populate } from './app/utils/db.js';

const app = express();
const db = new Database('./db.sqlite');
const port = 3000;

migrate(db);
populate(db);

const logMiddleware = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.path} - ${req.method}`);
  next();
}

app.use(logMiddleware);

app.get('/', getRoot);
app.get('/api/usuarios', getUsuarios);
app.get('/api/usuarios/:id', getUsuarioById);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
