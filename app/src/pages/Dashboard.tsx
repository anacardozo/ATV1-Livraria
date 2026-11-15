import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Wallet, Book } from 'lucide-react';
import { useEffect, useState } from 'react';
import { livroService } from '@/services/api';
import type { Livro } from '@/types/livro';

export function Dashboard() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    async function carregarLivros() {
        try {
            setCarregando(true);
            setErro(null);
            const dados = await livroService.list();
            setLivros(dados);
        } catch (err: unknown) {
            const mensagem = err instanceof Error ? err.message : 'Não foi possível carregar os livros do servidor.';
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        let ativo = true;

        async function buscarInicial() {
            try {
                const dados = await livroService.list();
                if (ativo) {
                    setLivros(dados);
                    setErro(null);
                }
            } catch (err: unknown) {
                if (ativo) {
                    const mensagem = err instanceof Error ? err.message : 'Não foi possível carregar os livros do servidor.';
                    setErro(mensagem);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        buscarInicial();

        return () => {
            ativo = false;
        };
    }, []);

    const totalLivros = livros.length;
    const totalAutores = new Set(livros.map((livro) => livro.autor)).size;

    const somaTotal = livros.reduce((soma, livro) => {
        const precoNumerico = Number(String(livro.preco ?? 0).replace(',', '.'));
        return soma + (isNaN(precoNumerico) ? 0 : precoNumerico);
    }, 0);

    const precoMedio = livros.length > 0 ? somaTotal / livros.length : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-velaris-light">Bem-vinda à Velaris Library</h1>
                <p className="text-sm text-velaris-light">Gerencie sua coleção de livros em um só lugar.</p>
            </div>

            {carregando ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : erro ? (
                <div className="p-4 text-sm text-red-500">
                    <p>Erro ao carregar dados: {erro}</p>
                    <button
                        onClick={carregarLivros}
                        className="mt-2 underline hover:text-red-400"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex gap-6 w-full items-center">
                        <Card className="max-w-xl shadow-md flex-1 hover:-translate-y-1 transition-all duration-250 ease-in-out">
                            <CardContent className="space-y-2 text-sm flex flex-col gap-1">
                                <p>
                                    <BookOpen
                                        size={25}
                                        className="text-primary"
                                        strokeWidth={1.8}
                                    />
                                </p>
                                <p className="text-2xl font-semibold">
                                    {totalLivros}
                                </p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle className="text-gray-400">Livros</CardTitle>
                            </CardHeader>
                        </Card>

                        <Card className="max-w-xl shadow-md flex-1 hover:-translate-y-1 transition-all duration-250 ease-in-out">
                            <CardContent className="space-y-2 text-sm flex flex-col gap-1">
                                <p>
                                    <Users
                                        size={25}
                                        className="text-primary"
                                        strokeWidth={1.8}
                                    />
                                </p>
                                <p className="text-2xl font-semibold">
                                    {totalAutores}
                                </p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle className="text-gray-400">Autores</CardTitle>
                            </CardHeader>
                        </Card>

                        <Card className="max-w-xl shadow-md flex-1 hover:-translate-y-1 transition-all duration-250 ease-in-out">
                            <CardContent className="space-y-2 text-sm flex flex-col gap-1">
                                <p>
                                    <Wallet
                                        size={25}
                                        className="text-primary"
                                        strokeWidth={1.8}
                                    />
                                </p>
                                <p className="text-2xl font-semibold">
                                    {precoMedio.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle className="text-gray-400">Preço Médio</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <h3 className='text-xl font-semibold text-velaris-light'>
                        Livros cadastrados recentemente
                    </h3>

                    <div className='flex gap-3 w-full flex-col'>
                        {livros.slice(-5).reverse().map((livro, index) => {
                            const precoFormatado = Number(
                                String(livro.preco ?? 0).replace(',', '.')
                            ).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            });
                            return (
                                <Card
                                    key={livro.id ?? index}
                                    className="w-full py-0 shadow-md hover:-translate-y-1 transition-all duration-250 ease-in-out"
                                >
                                    <CardContent className="p-4 flex items-center justify-between">

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-950">
                                                <Book size={20} strokeWidth={1.8} />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-base">
                                                    {livro.titulo}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {livro.autor}
                                                </p>
                                            </div>
                                        </div>


                                        <span className="text-sm font-medium text-gray-600">
                                            {precoFormatado}
                                        </span>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                </>
            )}
        </div>
    );
}