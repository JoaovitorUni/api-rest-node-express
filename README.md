## API Rest Node Express

Endpoints:
| Rota | Método | Status Retorno |
| :--- | :--- | :--- |
| `/` | GET | 200 |
| `/api/usuarios` | GET | 200 |
| `/api/usuarios/:id` | GET | 200 ou 404 |
| `/api/usuarios` | POST | 201 ou 400 |
| `/api/usuarios/:id` | PUT | 204 ou 404 |
| `/api/usuarios/:id` | DELETE | 204 ou 404 |
| `/api/login` | POST | 200 ou 401 |
| `/api/auth/example` | GET | 200 ou 401 |

## Instalação:

1. Instale as dependências:
```Shell
npm install
```

2. Crie e configure as variáveis de ambiente:
```Shell
cp .env-example .env
```

Descrição das variáveis:
| Env | Descrição | Default |
| :--- | :--- | :--- |
| JWT_SECRET | Assinatura digital do token | - |
| PORT | Porta de execução da API | 3000 |

3. Execute o projeto:
```Shell
npm run start
#ou
npm start
```

4. Teste se o projeto está executando com:
```Shell
curl 127.0.0.1:3000
```
