# 📚 Sistema de Gerenciamento de Livraria- Velaris Library - Projeto LDW

Este projeto foi desenvolvido para a disciplina de LDW. Trata-se de uma aplicação Full Stack para o gerenciamento de uma livraria, com a API construída em Node.js, utilizando TypeScript, **Sequelize como ORM** e banco de dados PostgreSQL (configurável para rodar localmente ou na nuvem usando Supabase), integrada a uma interface web desenvolvida em **React, TypeScript, Tailwind CSS e shadcn/ui**.

## 🚀 Tecnologias Utilizadas

- **Backend:** Node.js
- **Frontend:** React + Vite, Tailwind CSS, shadcn/ui e Sonner
- **Linguagem:** TypeScript
- **ORM:** [Sequelize](https://sequelize.org/)
- **Banco de Dados:** PostgreSQL (Supabase / Local via Docker)
- **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/pt/)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/installation)
- Git

## 🛠 Como instalar e rodar o projeto

**1. Clone o repositório**
```bash
git clone https://github.com/anacardozo/ATV1-Livraria.git
cd ATV1-Livraria
```

**2. Instalação das Dependências**
Este projeto utiliza um formato de monorepo (ou múltiplas pastas separadas). Você precisará instalar as dependências na raiz do projeto e também dentro das pastas específicas (`backend` e `app`).

Execute os comandos abaixo:
```bash
# Na raiz do projeto
pnpm install

# Na pasta do backend
cd backend
pnpm install
cd ..

# Na pasta do app
cd app
pnpm install
cd ..
```

**3. Configuração das Variáveis de Ambiente**

Na pasta do `backend`, você precisará criar um arquivo `.env` para configurar a conexão com o banco de dados e as portas do servidor.

Crie um arquivo chamado `.env` a partir do arquivo `.env.example`:

```bash
cd backend
cp .env.example .env
```

Abaixo está a estrutura do arquivo e as instruções de como configurá-lo de acordo com o seu banco de dados:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configuração do Banco de Dados PostgreSQL
DB_PORT=5432
DB_DIALECT=postgres
DB_NAME=sua_base_de_dados
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Escolha o HOST dependendo de onde a aplicação está rodando:
# 1. Se estiver rodando via Docker Compose (ambiente de CI/CD): use "db"
DB_HOST=db

# 2. Se estiver rodando localmente fora do Docker (ou usando o Supabase): use "localhost" ou a URL do Supabase
# DB_HOST=url_supabase

# 3. Configuração de SSL (Necessário para Supabase/nuvem, geralmente false para Docker local)
DB_SSL=false
```

### ⚙️ Como preencher o `.env` do backend dependendo do seu cenário:

* **Cenário A: Usando Banco de Dados Local (Docker/Localhost)**
  * Se usar Docker Compose, mantenha `DB_HOST=db`.
  * Se rodar o banco direto na máquina, mude para `DB_HOST=localhost`.
  * Mantenha `DB_SSL=false`.

* **Cenário B: Usando Supabase (Nuvem)**
  * Altere o `DB_HOST` para a URL fornecida no painel do seu Supabase.
  * Preencha a senha, usuário e nome do banco com os dados do Supabase.
  * **Importante:** Mude a flag SSL para true: `DB_SSL=true`.

Na pasta do `app` (frontend), crie também o arquivo `.env` a partir do `.env.example` para definir a URL base da API:

```bash
cd ../app
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000
```

**4. Executando as Migrations e Iniciando a aplicação**
Com os arquivos `.env` configurados e o banco de dados acessível, execute as migrations do Sequelize para criar as tabelas, inicie o servidor da API e, em outro terminal, inicie o frontend:

```bash
# Terminal 1 - Backend
cd backend

# Rodar as migrations do Sequelize para estruturar o banco de dados
pnpm sequelize-cli db:migrate # (Adapte este comando caso o seu script no package.json tenha outro nome)

# Iniciar o servidor
pnpm run dev
```

```bash
# Terminal 2 - Frontend
cd app

# Iniciar a interface web
pnpm run dev
```
