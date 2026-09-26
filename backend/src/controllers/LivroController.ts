import { Request, Response } from 'express';
import { Livro } from '../models/Livros';

export class LivroController {

    // GET /api/livros - Listar todos os Livros
    public static async index(req: Request, res: Response): Promise<Response> {
        try {

            const livros = await Livro.findAll({
                attributes: ['id', 'titulo', 'autor', 'preco', 'sinopse', 'anoPublicacao', 'updatedAt']
            });

            return res.status(200).json(livros);

        } catch (error: any) {

            return res.status(500).json({ erro: 'Erro ao listar todos os Livros!', detalhe: error.message });

        }
    }

    // GET /api/livros/:id - Listar um Livro por ID
    public static async show(req: Request, res: Response): Promise<Response> {
        try {

            const { id } = req.params;

            const livro = await Livro.findByPk(Number(id), {
                attributes: ['id', 'titulo', 'autor', 'preco', 'sinopse', 'anoPublicacao', 'updatedAt']
            });

            if (!livro) {
                return res.status(404).json({ erro: 'Livro não encontrado!' });
            }

            return res.status(200).json(livro);

        } catch (error: any) {

            return res.status(500).json({ erro: 'Erro ao listar o Livro!', detalhe: error.message });

        }
    }

    // POST /api/livros - Cadastrar Novo Livro
    public static async create(req: Request, res: Response): Promise<Response> {
        try {

            const { titulo, autor, preco, sinopse, anoPublicacao } = req.body;

            if (!titulo || !autor || !preco || !sinopse || !anoPublicacao) {
                return res.status(400).json({ erro: 'titulo, autor, preço, sinopse, anoPublicacao são obrigatórios!' });
            }

            const novoLivro = await Livro.create({ titulo, autor, preco, sinopse, anoPublicacao });

            return res.status(201).json({
                id: novoLivro.id,
                titulo: novoLivro.titulo,
                autor: novoLivro.autor,
                preco: novoLivro.preco,
                sinopse: novoLivro.sinopse,
                anoPublicacao: novoLivro.anoPublicacao,
                createdAt: novoLivro.createdAt
            });

        } catch (error: any) {

            return res.status(500).json({ erro: 'Erro ao cadastar o Livro', detalhe: error.message });

        }
    }

    // PUT /api/livros/:id - Atualizar um Livro existente
    public static async update(req: Request, res: Response): Promise<Response> {
        try {

            const { id } = req.params;
            const { titulo, autor, preco, sinopse, anoPublicacao } = req.body;

            const livro = await Livro.findByPk(Number(id));

            if (!livro) {
                return res.status(404).json({ erro: 'Livro não encontrado para atualização!' });
            }

            if (titulo) livro.titulo = titulo;
            if (autor) livro.autor = autor;
            if (preco) livro.preco = preco;
            if (sinopse) livro.sinopse = sinopse;
            if (anoPublicacao) livro.anoPublicacao = anoPublicacao;

            await livro.save();

            return res.status(201).json({
                id: livro.id,
                titulo: livro.titulo,
                autor: livro.autor,
                preco: livro.preco,
                sinopse: livro.sinopse,
                anoPublicacao: livro.anoPublicacao,
                updatedAt: livro.updateAt
            });

        } catch (error: any) {

            return res.status(500).json({ erro: 'Erro ao atualizar o Livro', detalhe: error.message });

        }
    }

    // DELETE /api/livros/:id - Remover um Livro
    public static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const livro = await Livro.findByPk(Number(id));

            if (!livro) {
                return res.status(404).json({ erro: 'Livro não encontrado para exclusão.' });
            }

            await livro.destroy();
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao excluir Livro.', detalhe: error.message });
        }
    }

}