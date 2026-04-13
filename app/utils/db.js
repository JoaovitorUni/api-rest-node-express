import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

const db = new Database('./db.sqlite');

function migrate(db) {
	const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      senha VARCHAR(255) NOT NULL,
      cargo VARCHAR(100) NOT NULL,
      idade INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NULL
    )
  `;
	db.exec(query);
}
async function populate(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (count > 0) return;

	const data = [
		{ nome: "Alice Silva", senha: await bcrypt.hash("1", 10), cargo: "Desenvolvedora", idade: 28, ativo: 1 },
		{ nome: "Bruno Costa", senha: await bcrypt.hash("12", 10), cargo: "Designer", idade: 34, ativo: 0 },
		{ nome: "Carla Souza", senha: await bcrypt.hash("123", 10), cargo: "Desenvolvedora", idade: 22, ativo: 1 },
		{ nome: "Daniel Oliveira", senha: await bcrypt.hash("1234", 10), cargo: "Gerente", idade: 40, ativo: 1 }
	];
	const query = db.prepare('INSERT INTO users (nome, senha, cargo, idade, is_active) VALUES (?, ?, ?, ?, ?)');
	db.transaction((data) => {
		for (const user of data) {
			query.run(user.nome, user.senha, user.cargo, user.idade, user.ativo);
		}
	})(data);
}

export { db, migrate, populate };
