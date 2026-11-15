import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { livroService } from "@/services/api";
import { toast } from "sonner";

export function Cadastrar() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [preco, setPreco] = useState('');
    const [sinopse, setSinopse] = useState('');
    const [anoPublicacao, setAnoPublicacao] = useState('');
    const [capaUrl, setCapaUrl] = useState('');

    const [enviando, setEnviando] = useState(false);

    async function cadastrarLivro(e: FormEvent) {
        e.preventDefault();

        try {
            setEnviando(true);

            const precoNumerico = Number(preco.replace(',', '.'));
            const anoNumerico = Number(anoPublicacao);

            await livroService.create({
                titulo,
                autor,
                preco: precoNumerico,
                sinopse,
                anoPublicacao: anoNumerico,
                capa_url: capaUrl.trim() !== '' ? capaUrl : null,
            });
            setTitulo('');
            setAutor('');
            setPreco('');
            setSinopse('');
            setAnoPublicacao('');
            setCapaUrl('');
            toast.success('Livro Cadastrado com Sucesso!');
        } catch (err: unknown) {
            const mensagem = err instanceof Error ? err.message : 'Erro ao cadastrar livro.';
            toast.error(mensagem);
        } finally {
            setEnviando(false);
        }
    }

    return (

        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-velaris-light">
                        Cadastrar
                    </h1>
                    <p className="text-sm text-velaris-light">
                        Adicione um novo livro a Biblioteca
                    </p>
                </div>
            </div>

            <Card className="rounded-2xl p-8 shadow-sm bg-white">
                <form onSubmit={cadastrarLivro} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="w-full flex flex-col gap-3">
                            <Label className="text-base font-semibold text-velaris-light">
                                Título
                            </Label>
                            <Input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="EX: Tempestade de Ônix"
                                required
                                className="border outline-none border-velaris"
                            />
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <Label className="text-base font-semibold text-velaris-light">
                                Autor
                            </Label>
                            <Input
                                type="text"
                                value={autor}
                                onChange={(e) => setAutor(e.target.value)}
                                placeholder="EX: Rebecca Yarros"
                                required
                                className="border outline-none border-velaris"
                            />
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <Label className="text-base font-semibold text-velaris-light">
                                Preço
                            </Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                placeholder="EX: 59.90"
                                required
                                className="border outline-none border-velaris"
                            />
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <Label className="text-base font-semibold text-velaris-light">
                                Ano de Publicação
                            </Label>
                            <Input
                                type="number"
                                value={anoPublicacao}
                                onChange={(e) => setAnoPublicacao(e.target.value)}
                                placeholder="EX: 2025"
                                required
                                className="border outline-none border-velaris"
                            />
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <Label className="text-base font-semibold text-velaris-light">
                                Sinopse
                            </Label>
                            <Input
                                type="text"
                                maxLength={200}
                                value={sinopse}
                                onChange={(e) => setSinopse(e.target.value)}
                                placeholder="Breve descrição do livro..."
                                required
                                className="border outline-none border-velaris"
                            />
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <Label className="text-base font-semibold text-velaris-light">
                                Capa (opcional)
                            </Label>
                            <Input
                                type="url"
                                value={capaUrl}
                                onChange={(e) => setCapaUrl(e.target.value)}
                                placeholder="Digite a URL da capa do Livro"
                                className="border outline-none border-velaris"
                            />
                        </div>
                    </div>

                        <Button
                            type="submit"
                            disabled={enviando}
                            className="px-6 py-5 text-sm font-semibold cursor-pointer"
                        >
                            {enviando ? 'Cadastrando...' : 'Cadastrar Livro'}
                        </Button>
                </form>
            </Card>
        </div>
    );
}