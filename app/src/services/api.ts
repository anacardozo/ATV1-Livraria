
import type { Livro, CreateLivroDTO } from "../types/livro";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE_URL = `${BASE_URL}/api`;

export const livroService = {
  // GET /api/livros - Listar todos os livros
  async list(): Promise<Livro[]> {
    const resposta = await fetch(`${API_BASE_URL}/livros`);

    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => ({}));
      throw new Error(erroBody.erro || "Falha ao buscar a lista de livros.");
    }

    return resposta.json();
  },

  // GET /api/livros/:id - Buscar livro pelo ID
  async getById(id: number): Promise<Livro> {
    const resposta = await fetch(`${API_BASE_URL}/livros/${id}`);

    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => ({}));
      throw new Error(erroBody.erro || "Falha ao buscar o livro.");
    }

    return resposta.json();
  },

  // POST /api/livros - Cadastrar novo livro
  async create(dados: CreateLivroDTO): Promise<Livro> {
    const resposta = await fetch(`${API_BASE_URL}/livros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => ({}));
      throw new Error(erroBody.erro || "Falha ao cadastrar livro.");
    }

    return resposta.json();
  },

  // PUT /api/livros/:id - Editar livro
  async update(id: number, dados: CreateLivroDTO): Promise<Livro> {
    const resposta = await fetch(`${API_BASE_URL}/livros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => ({}));
      throw new Error(erroBody.erro || "Falha ao editar livro.");
    }

    return resposta.json();
  },

  // DELETE /api/livros/:id - Deletar livro
  async delete(id: number): Promise<void> {
    const resposta = await fetch(`${API_BASE_URL}/livros/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => ({}));
      throw new Error(erroBody.erro || "Falha ao deletar livro.");
    }
  },
};
