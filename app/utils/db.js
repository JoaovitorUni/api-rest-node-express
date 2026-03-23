function migrate(db) {
	const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      cargo VARCHAR(100) NOT NULL,
      idade INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NULL
    )
  `;
	db.exec(query);
}

function populate(db) {
	const data = [
		{ id: 1, nome: "Teste 1", cargo: "Desenvolvedora", idade: 28, ativo: true },
		{ id: 2, nome: "Teste 2", cargo: "Designer", idade: 34, ativo: false },
		{ id: 3, nome: "Teste 3", cargo: "Desenvolvedora", idade: 22, ativo: true },
		{ id: 4, nome: "Teste 4", cargo: "Gerente", idade: 40, ativo: true }
	];
	const query = db.prepare('INSERT INTO users (nome, cargo, idade, is_active) VALUES (?, ?, ?, ?)');
	db.transaction((data) => {
		for (const user of data) {
			query.run(user.nome, user.cargo, user.idade, user.ativo ? 'TRUE' : 'FALSE');
		}
	})(data);
}

export { migrate, populate };