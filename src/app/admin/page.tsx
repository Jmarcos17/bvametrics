import { Layout } from '@/components/Layout';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { AdminTable } from '@/components/AdminTable';
import Link from 'next/link';

export default async function AdminPage() {
  await requireAdmin();

  const connections = await db.facebookConnection.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formattedConnections = connections.map((conn) => ({
    id: conn.id,
    userId: conn.userId,
    clientId: conn.clientId,
    userEmail: conn.user?.email,
    userName: conn.user?.name,
    clientName: conn.client?.name,
    clientEmail: conn.client?.email,
    fbUserId: conn.fbUserId,
    businessIds: conn.businessIds,
    adAccountIds: conn.adAccountIds,
    expiresAt: conn.expiresAt,
    dataAccessExpiresAt: conn.dataAccessExpiresAt,
    createdAt: conn.createdAt,
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Painel Administrativo
            </h1>
            <p className="mt-2 text-slate-600">
              Gerencie clientes e visualize todas as conexões Meta Ads
            </p>
          </div>
          <Link
            href="/admin/clients"
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:scale-[1.02]"
          >
            Gerenciar Clientes
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Todas as Conexões
            </h2>
            <div className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
              Total: {connections.length}
            </div>
          </div>
          <AdminTable connections={formattedConnections} />
        </div>
      </div>
    </Layout>
  );
}
