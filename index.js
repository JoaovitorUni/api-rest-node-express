import express from 'express';
import { getRoot, getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from './app/handlers/handlers.js';
import { db, migrate, populate } from './app/utils/db.js';

const app = express();
const port = 3000;

migrate(db);
populate(db);

const logMiddleware = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.path} - ${req.method}`);
  next();
}

app.use(express.json());
app.use(logMiddleware);

app.get('/', getRoot);
app.get('/api/usuarios', getUsuarios);
app.get('/api/usuarios/:id', getUsuarioById);
app.post('/api/usuarios', createUsuario);
app.put('/api/usuarios/:id', updateUsuario);
app.delete('/api/usuarios/:id', deleteUsuario);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
