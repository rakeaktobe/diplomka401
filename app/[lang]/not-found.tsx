import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <FileQuestion className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Страница не найдена
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          К сожалению, запрашиваемая вами страница не существует или была перемещена.
        </p>

        <Button size="lg" className="rounded-full px-8 p-0">
          <Link href="/" className="flex items-center justify-center gap-2 w-full h-full">
            <Home className="w-4 h-4" />
            На главную
          </Link>
        </Button>
      </div>
    </div>
  );
}
