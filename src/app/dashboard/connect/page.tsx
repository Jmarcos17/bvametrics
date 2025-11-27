import { Layout } from '@/components/Layout';
import { requireAuth } from '@/lib/auth';
import { ConnectFacebookButton } from '@/components/ConnectFacebookButton';

export default async function ConnectPage() {
  await requireAuth();

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Conectar com Facebook
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Conecte sua conta do Facebook para permitir acesso aos seus Business
            Managers e contas de anúncio.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-8 dark:bg-zinc-900">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              O que será conectado?
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
              <li>Business Managers associados à sua conta</li>
              <li>Contas de anúncio (Ad Accounts)</li>
              <li>Dados de campanhas e insights</li>
            </ul>
            <div className="pt-4">
              <ConnectFacebookButton />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

