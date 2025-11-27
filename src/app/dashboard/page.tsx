import { Layout } from '@/components/Layout';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { ConnectionsList } from '@/components/ConnectionsList';
import Link from 'next/link';
import { ConnectFacebookButton } from '@/components/ConnectFacebookButton';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  const connections = await db.facebookConnection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Gerencie suas conexões com Meta Ads
            </p>
          </div>
          <Link href="/dashboard/connect">
            <ConnectFacebookButton />
          </Link>
        </div>

        {params.connected === 'true' && (
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
            Conexão com Facebook estabelecida com sucesso! ✓
          </div>
        )}

        {params.error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
            Erro: {decodeURIComponent(params.error)}
          </div>
        )}

        {connections.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white/60 backdrop-blur-sm p-12 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Nenhuma conexão encontrada
            </h3>
            <p className="mt-2 text-slate-600">
              Conecte sua conta do Facebook para começar a gerar relatórios
              automáticos.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/connect">
                <ConnectFacebookButton />
              </Link>
            </div>
          </div>
        ) : (
          <ConnectionsList initialConnections={connections} />
        )}
      </div>
    </Layout>
  );
}
