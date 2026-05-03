'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Что-то пошло не так
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">
          Произошла непредвиденная ошибка. Мы уже работаем над ее исправлением.
          {error.digest && (
            <code className="block mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs">
              ID: {error.digest}
            </code>
          )}
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()} 
            className="w-full flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Попробовать снова
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full p-0"
          >
            <Link href="/" className="flex items-center justify-center gap-2 w-full h-full">
              <Home className="w-4 h-4" />
              Вернуться на главную
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
