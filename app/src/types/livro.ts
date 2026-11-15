export interface Livro {
    id: number;
    titulo: string;
    autor: string;
    preco: number;
    sinopse: string;
    anoPublicacao: number;
    capa_url: string | null;
    createdAt: string;
}

export interface CreateLivroDTO {
    titulo: string;
    autor: string;
    preco: number;
    sinopse: string;
    anoPublicacao: number;
    capa_url: string | null;
}