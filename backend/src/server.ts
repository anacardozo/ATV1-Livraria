import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { Livro } from './models/Livros';

dotenv.config();

const app = express();
const PORT = process.env.port || 3000;

app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        mensagem: 'Servidor Backendo rodando com sucesso.',
        timestamp: new Date().toISOString()
    });
});


// Rota para Cadastrar Novo Livro
app.post('/api/livros', async (req: Request, res: Response) => {
    try {

        const { titulo, autor, preco, sinopse, anoPublicacao } = req.body;

        if (!titulo || !autor || !preco || !sinopse || !anoPublicacao) {
            return res.status(400).json({ erro: 'titulo, autor, preço, sinopse, anoPublicacao são obrigatórios!' });
        }

        const novoLivro = await Livro.create({ titulo, autor, preco, sinopse, anoPublicacao });

        return res.status(201).json(novoLivro);

    } catch (error: any) {

        return res.status(500).json({ erro: 'Erro ao cadastar o Livro', detalhe: error.message });

    }
});

// Rota para Listar todos os Livros
app.get('/api/livros', async (req: Request, res: Response) => {
    try {

        const livros = await Livro.findAll({
            attributes: ['id', 'titulo', 'autor', 'preco', 'sinopse', 'anoPublicacao', 'createdAt']
        });

        return res.status(200).json(livros);

    } catch (error: any) {

        return res.status(500).json({ erro: 'Erro ao listar todos os Livros!', detalhe: error.message });

    }
});

async function main() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados PostgreSQL estabelecida com Sucesso!.');

        app.listen(PORT, () => {
            console.log(`Servidor rodando em: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error ao conectar com o banco de dados: ', error);
    }
}

main();