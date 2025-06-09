# Eightware Backend

Este é o backend de autenticação de usuários do teste técnico Eightware, desenvolvido em Node.js com TypeScript, Express e MongoDB.

## Tecnologias Utilizadas

- **Node.js** e **TypeScript**
- **Express**
- **MongoDB** com **Mongoose** 
- **JWT** 
- **Passport** e **passport-jwt** 
- **bcryptjs** 
- **dotenv** 
- **Jest** e **Supertest** 
- **CORS**

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/mtrodrigo/eightware_backend.git
cd eightware_backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
JWT_SECRET=sua_chave_secreta
MONGO_URI=mongodb://localhost:27017/
```

### 4. Configure o MongoDB no Compass

- Abra o **MongoDB Compass**.
- Clique em **New Connection**.
- Use a string de conexão:  
  `mongodb://localhost:27017/`
- Crie um banco de dados chamado, `eightware`.
- Certifique-se de que o MongoDB está rodando localmente.

### 5. Rode o servidor em modo desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5000`.

### 6. Rodando os testes

```bash
npm test -- --verbose
```

---

## Estrutura de Rotas

- `POST /users/signup` — Cadastro de usuário
- `POST /users/login` — Login de usuário
- `GET /users/me` — Perfil do usuário (rota protegida, requer JWT)

---

## Observações

- Para acessar rotas protegidas, envie o token JWT no header:  
  `Authorization: Bearer <seu_token>`
- Certifique-se de que o MongoDB está rodando antes de iniciar a aplicação.

---

## Criado por

-Rodrigo Marques Tavares
- **Email:** rodrigour@gmail.com
- **WhatsApp:** (35) 98406-1841