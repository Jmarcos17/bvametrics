import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ConnectPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { token } = await params;
  const queryParams = await searchParams;

  // Verify client token exists and is active
  const client = await db.client.findUnique({
    where: { token, active: true },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-slate-200/60">
        <div>
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Conectar com Facebook
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Conecte sua conta do Facebook para permitir acesso aos seus Business
            Managers e contas de anúncio.
          </p>
        </div>

        {queryParams.success === 'true' && (
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
            ✓ Conexão estabelecida com sucesso! Você pode fechar esta página.
          </div>
        )}

        {queryParams.error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
            Erro: {decodeURIComponent(queryParams.error)}
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              O que será conectado?
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Business Managers associados à sua conta</li>
              <li>Contas de anúncio (Ad Accounts)</li>
              <li>Dados de campanhas e insights</li>
            </ul>
          </div>

          <Link
            href={`/api/connect/${token}`}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#1877F2] px-6 py-3 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:scale-[1.02]"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Conectar com Facebook
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500">
          Cliente: <span className="font-medium text-slate-700">{client.name}</span>
        </p>
      </div>
    </div>
  );
}
