import { Layout } from '@/components/Layout';
import { requireAdmin } from '@/lib/auth';
import { ClientsManager } from '@/components/ClientsManager';

export default async function ClientsPage() {
  await requireAdmin();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gerenciar Clientes
          </h1>
          <p className="mt-2 text-slate-600">
            Crie e gerencie clientes e seus links de conexão
          </p>
        </div>

        <ClientsManager />
      </div>
    </Layout>
  );
}
