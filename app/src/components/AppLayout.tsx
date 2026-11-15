// src/components/AppLayout.tsx
import { Outlet, Link } from 'react-router-dom';
import { MoonStar, Plus } from 'lucide-react';
import { Button} from '@/components/ui/button';

export function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-velaris border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <MoonStar
                        size={25}
                        className="text-gold"
                        strokeWidth={1.8}
                    />

                    <span className="font-bold text-base tracking-wide text-white">
                        Velaris Library
                    </span>
                </div>
                <nav className="flex gap-4 text-sm font-medium text-slate-600 items-center">
                    <Link to="/dashboard" className="text-white hover:text-gold">Painel</Link>
                    <Link to="/biblioteca" className="text-white hover:text-gold">Biblioteca</Link>
                    <Button className="flex items-center bg-gold cursor-pointer">
                        <Plus
                            size={25}
                            className="text-white"
                            strokeWidth={1.8}
                        />
                        <Link to="/cadastrar" className="text-white">Cadastrar</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1 w-full mx-auto py-6 px-12">
                <Outlet />
            </main>
        </div>
    );
}