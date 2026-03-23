import Database from 'better-sqlite3';

const db = new Database('./db.sqlite');

function migrate(db) {
	const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      cargo VARCHAR(100) NOT NULL,
      idade INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NULL
    )
  `;
	db.exec(query);
}

function populate(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (count > 0) return;

	const data = [
		{ nome: "Alice Silva", cargo: "Desenvolvedora", idade: 28, ativo: 1 },
		{ nome: "Bruno Costa", cargo: "Designer", idade: 34, ativo: 0 },
		{ nome: "Carla Souza", cargo: "Desenvolvedora", idade: 22, ativo: 1 },
		{ nome: "Daniel Oliveira", cargo: "Gerente", idade: 40, ativo: 1 }
	];
	const query = db.prepare('INSERT INTO users (nome, cargo, idade, is_active) VALUES (?, ?, ?, ?)');
	db.transaction((data) => {
		for (const user of data) {
			query.run(user.nome, user.cargo, user.idade, user.ativo);
		}
	})(data);
}

export { db, migrate, populate };
