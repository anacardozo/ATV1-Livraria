import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import { appRoutes } from './routes';

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

// registra todas as rotas da aplicação sob o prefixo /api
app.use('/api', appRoutes);


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