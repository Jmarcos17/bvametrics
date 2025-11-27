'use client';

import { formatDate, isTokenExpired } from '@/lib/utils';

interface Connection {
  id: string;
  userId: string | null;
  clientId: string | null;
  userEmail?: string;
  userName?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  fbUserId: string;
  businessIds: string[] | number[] | null;
  adAccountIds: string[] | number[] | null;
  expiresAt: Date | string | null;
  dataAccessExpiresAt: Date | string | null;
  createdAt: Date | string;
}

interface AdminTableProps {
  connections: Connection[];
}

export function AdminTable({ connections }: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
              Cliente/Usuário
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
              Facebook User ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
              Business Managers
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
              Contas de Anúncio
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
              Expira em
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
              Criado em
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {connections.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                Nenhuma conexão encontrada
              </td>
            </tr>
          ) : (
            connections.map((conn) => {
              const expired = isTokenExpired(conn.expiresAt);
              return (
                <tr key={conn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    {conn.clientId ? (
                      <>
                        <div className="text-sm font-medium text-slate-900">
                          {conn.clientName || 'Cliente'}
                        </div>
                        {conn.clientEmail && (
                          <div className="text-sm text-slate-500">
                            {conn.clientEmail}
                          </div>
                        )}
                        <div className="text-xs text-indigo-600 font-medium mt-0.5">
                          (Cliente)
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-slate-900">
                          {conn.userName || 'Admin'}
                        </div>
                        {conn.userEmail && (
                          <div className="text-sm text-slate-500">
                            {conn.userEmail}
                          </div>
                        )}
                        <div className="text-xs text-purple-600 font-medium mt-0.5">
                          (Admin)
                        </div>
                      </>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 font-mono">
                    {conn.fbUserId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                      {Array.isArray(conn.businessIds) ? conn.businessIds.length : 0}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      {Array.isArray(conn.adAccountIds) ? conn.adAccountIds.length : 0}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {expired ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
                        Expirado
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        Ativo
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {formatDate(conn.expiresAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {formatDate(conn.createdAt)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
