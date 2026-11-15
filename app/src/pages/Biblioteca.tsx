import { useEffect, useState, type FormEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Book, Pencil, Eye, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { livroService } from '@/services/api';
import type { Livro } from '@/types/livro';

export function Biblioteca() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [busca, setBusca] = useState('');

    const [livroDetalhes, setLivroDetalhes] = useState<Livro | null>(null);
    const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
    const [livroExcluindo, setLivroExcluindo] = useState<Livro | null>(null);

    const [editTitulo, setEditTitulo] = useState('');
    const [editAutor, setEditAutor] = useState('');
    const [editPreco, setEditPreco] = useState('');
    const [editAno, setEditAno] = useState('');
    const [editSinopse, setEditSinopse] = useState('');
    const [editCapaUrl, setEditCapaUrl] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    function formatarPreco(valor: number | string | undefined) {
        return Number(String(valor ?? 0).replace(',', '.')).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    async function carregarLivros() {
        try {
            setCarregando(true);
            setErro(null);
            const dados = await livroService.list();
            setLivros(dados);
        } catch (err: unknown) {
            const mensagem = err instanceof Error ? err.message : 'Erro inesperado.';
            setErro(mensagem)
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
                    const mensagem =
                        err instanceof Error
                            ? err.message
                            : 'Não foi possível carregar os livros do servidor.';
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

    function abrirModalEditar(livro: Livro) {
        setLivroEditando(livro);
        setEditTitulo(livro.titulo);
        setEditAutor(livro.autor);
        setEditPreco(String(livro.preco));
        setEditAno(String(livro.anoPublicacao));
        setEditSinopse(livro.sinopse || '');
        setEditCapaUrl(livro.capa_url || '');
    }

    async function handleSalvarEdicao(e: FormEvent) {
        e.preventDefault();
        if (!livroEditando) return;

        try {
            setSalvando(true);
            const precoNumerico = Number(editPreco.replace(',', '.'));
            const anoNumerico = Number(editAno);

            const livroAtualizado = await livroService.update(livroEditando.id, {
                titulo: editTitulo,
                autor: editAutor,
                preco: precoNumerico,
                anoPublicacao: anoNumerico,
                sinopse: editSinopse,
                capa_url: editCapaUrl.trim() !== '' ? editCapaUrl.trim() : null,
            });

            setLivros((listaAtual) =>
                listaAtual.map((item) =>
                    item.id === livroEditando.id ? { ...item, ...livroAtualizado } : item
                )
            );

            toast.success('Livro atualizado com sucesso!');
            setLivroEditando(null);
        } catch (err: unknown) {
            const mensagem = err instanceof Error ? err.message : 'Erro ao atualizar o livro.';
            toast.error(mensagem);
        } finally {
            setSalvando(false);
        }
    }

    async function handleConfirmarExclusao() {
        if (!livroExcluindo) return;

        try {
            setExcluindo(true);
            await livroService.delete(livroExcluindo.id);
            setLivros((listaAtual) =>
                listaAtual.filter((livro) => livro.id !== livroExcluindo.id)
            );

            toast.success('Livro deletado com sucesso!');
            setLivroExcluindo(null);
        } catch (err: unknown) {
            const mensagem = err instanceof Error ? err.message : 'Erro ao deletar o livro.';
            toast.error(mensagem);
        } finally {
            setExcluindo(false);
        }
    }

    const livrosFiltrados = livros.filter(
        (livro) =>
            livro.titulo.toLowerCase().includes(busca.toLowerCase()) ||
            livro.autor.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-velaris-light">
                        Biblioteca
                    </h1>
                    <p className="text-sm text-velaris-light">
                        Consulte, filtre e gerencie todos os livros cadastrados.
                    </p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por título ou autor..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none focus:border-primary"
                />
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
                <Card className="rounded-2xl p-6 shadow-sm bg-white">
                    {livrosFiltrados.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-400">
                            Nenhum livro encontrado.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-velaris hover:bg-transparent">
                                    <TableHead className="w-20" />
                                    <TableHead className="font-semibold text-velaris">Título</TableHead>
                                    <TableHead className="w-28 text-center font-semibold text-velaris">Ano</TableHead>
                                    <TableHead className="w-32 text-center font-semibold text-velaris">Preço</TableHead>
                                    <TableHead className="w-32 text-center font-semibold text-velaris">Detalhes</TableHead>
                                    <TableHead className="w-24 text-center font-semibold text-velaris">
                                        Ações
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {livrosFiltrados.map((livro) => (
                                    <TableRow key={livro.id} className="border-b border-gray-100 hover:bg-transparent">
                                        <TableCell className="py-4">
                                            {livro.capa_url ? (
                                                <img
                                                    src={livro.capa_url}
                                                    alt={livro.titulo}
                                                    className="h-20 w-14 rounded object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex h-20 w-14 items-center justify-center rounded bg-purple-100 text-purple-900">
                                                    <Book size={22} strokeWidth={1.8} />
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell className="py-4">
                                            <p className="text-base font-medium text-gray-900">
                                                {livro.titulo}
                                            </p>
                                            <p className="text-sm text-gray-500">{livro.autor}</p>
                                        </TableCell>

                                        <TableCell className="py-4 text-center">
                                            <Badge
                                                variant="secondary"
                                                className="rounded-md bg-purple-100 px-3 py-3 text-xs font-normal text-purple-900 hover:bg-purple-100"
                                            >
                                                {livro.anoPublicacao}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="py-4 text-gray-700 text-center">
                                            {formatarPreco(livro.preco)}
                                        </TableCell>

                                        <TableCell className="py-4 text-center">
                                            <Button
                                                className="cursor-pointer bg-velaris"
                                                onClick={() => setLivroDetalhes(livro)}
                                            >
                                                Detalhes
                                                <Eye size={18} />
                                            </Button>
                                        </TableCell>

                                        <TableCell className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => abrirModalEditar(livro)}
                                                    className="p-2 text-velaris-light transition-colors hover:text-primary cursor-pointer rounded-md hover:bg-purple-100"
                                                    title="Editar livro"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setLivroExcluindo(livro)}
                                                    className="p-2 text-red-500 transition-colors hover:text-red-600 cursor-pointer rounded-md hover:bg-purple-100"
                                                    title="Excluir livro"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            )}

            <Dialog
                open={!!livroDetalhes}
                onOpenChange={(aberto) => !aberto && setLivroDetalhes(null)}
            >
                <DialogContent className="sm:max-w-2xl rounded-2xl p-6 sm:p-8 bg-white">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{livroDetalhes?.titulo}</DialogTitle>
                        <DialogDescription>Detalhes completos do livro</DialogDescription>
                    </DialogHeader>

                    {livroDetalhes && (
                        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 sm:gap-8 items-start">
                            <div className="w-full">
                                {livroDetalhes.capa_url ? (
                                    <img
                                        src={livroDetalhes.capa_url}
                                        alt={livroDetalhes.titulo}
                                        className="w-full h-72 md:h-80 rounded-2xl object-cover shadow-md"
                                    />
                                ) : (
                                    <div className="flex w-full h-72 md:h-80 flex-col items-center justify-center gap-2 rounded-2xl bg-purple-100 text-purple-900 shadow-inner">
                                        <Book size={48} strokeWidth={1.5} />
                                        <span className="text-xs font-medium">Sem capa cadastrada</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-between space-y-4">
                                <div className="space-y-1.5">
                                    <Badge
                                        variant="secondary"
                                        className="rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-900 hover:bg-purple-100"
                                    >
                                        Velaris Library
                                    </Badge>

                                    <h2 className="text-2xl font-bold text-velaris leading-tight pt-1">
                                        {livroDetalhes.titulo}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        por {livroDetalhes.autor}
                                    </p>
                                </div>

                                <p className="text-2xl font-semibold text-velaris">
                                    {formatarPreco(livroDetalhes.preco)}
                                </p>

                                <div className="pt-2">
                                    <div className="border-b border-gray-200 pb-1.5 mb-3">
                                        <span className="border-b-2 border-velaris pb-1.5 text-sm font-semibold text-velaris">
                                            Sinopse
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-600">
                                        {livroDetalhes.sinopse || 'Nenhuma sinopse informada.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="rounded-xl bg-purple-50/60 p-3 border border-purple-100">
                                        <p className="text-xs text-gray-500">Publicação</p>
                                        <p className="text-sm font-semibold text-velaris mt-0.5">
                                            {livroDetalhes.anoPublicacao}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!livroEditando}
                onOpenChange={(aberto) => !aberto && setLivroEditando(null)}
            >
                <DialogContent className="sm:max-w-xl rounded-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-velaris">Editar Livro</DialogTitle>
                        <DialogDescription>
                            Altere as informações abaixo e clique em salvar.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSalvarEdicao} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-titulo" className="text-velaris-light font-semibold">
                                    Título
                                </Label>
                                <Input
                                    id="edit-titulo"
                                    value={editTitulo}
                                    onChange={(e) => setEditTitulo(e.target.value)}
                                    required
                                    className="border outline-none border-velaris"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-autor" className="text-velaris-light font-semibold">
                                    Autor
                                </Label>
                                <Input
                                    id="edit-autor"
                                    value={editAutor}
                                    onChange={(e) => setEditAutor(e.target.value)}
                                    required
                                    className="border outline-none border-velaris"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-preco" className="text-velaris-light font-semibold">
                                    Preço
                                </Label>
                                <Input
                                    id="edit-preco"
                                    type="number"
                                    step="0.01"
                                    value={editPreco}
                                    onChange={(e) => setEditPreco(e.target.value)}
                                    required
                                    className="border outline-none border-velaris"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="edit-ano" className="text-velaris-light font-semibold">
                                    Ano de Publicação
                                </Label>
                                <Input
                                    id="edit-ano"
                                    type="number"
                                    value={editAno}
                                    onChange={(e) => setEditAno(e.target.value)}
                                    required
                                    className="border outline-none border-velaris"
                                />
                            </div>

                            <div className="flex flex-col gap-2 sm:col-span-2">
                                <Label htmlFor="edit-sinopse" className="text-velaris-light font-semibold">
                                    Sinopse
                                </Label>
                                <Input
                                    id="edit-sinopse"
                                    maxLength={200}
                                    value={editSinopse}
                                    onChange={(e) => setEditSinopse(e.target.value)}
                                    required
                                    className="border outline-none border-velaris"
                                />
                            </div>

                            <div className="flex flex-col gap-2 sm:col-span-2">
                                <Label htmlFor="edit-capa" className="text-velaris-light font-semibold">
                                    Capa (opcional)
                                </Label>
                                <Input
                                    id="edit-capa"
                                    type="url"
                                    value={editCapaUrl}
                                    onChange={(e) => setEditCapaUrl(e.target.value)}
                                    placeholder="Digite a URL da capa do Livro"
                                    className="border outline-none border-velaris"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setLivroEditando(null)}
                                disabled={salvando}
                                className="cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={salvando}
                                className="bg-velaris cursor-pointer"
                            >
                                {salvando ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!livroExcluindo}
                onOpenChange={(aberto) => !aberto && setLivroExcluindo(null)}
            >
                <DialogContent className="sm:max-w-md rounded-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-velaris">Excluir Livro</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir{' '}
                            <strong className="text-gray-900">{livroExcluindo?.titulo}</strong>?
                            Essa ação não poderá ser desfeita.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setLivroExcluindo(null)}
                            disabled={excluindo}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmarExclusao}
                            disabled={excluindo}
                            className="cursor-pointer"
                        >
                            {excluindo ? 'Excluindo...' : 'Confirmar Exclusão'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}