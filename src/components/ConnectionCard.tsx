'use client';

import { formatDate, isTokenExpired } from '@/lib/utils';
import { useState } from 'react';

interface ConnectionCardProps {
  id: string;
  fbUserId: string;
  businessIds: string[] | number[] | null;
  adAccountIds: string[] | number[] | null;
  expiresAt: Date | string | null;
  dataAccessExpiresAt: Date | string | null;
  createdAt: Date | string;
  onDelete?: (id: string) => void;
}

export function ConnectionCard({
  id,
  fbUserId,
  businessIds,
  adAccountIds,
  expiresAt,
  dataAccessExpiresAt,
  createdAt,
  onDelete,
}: ConnectionCardProps) {
  const [deleting, setDeleting] = useState(false);
  const expired = isTokenExpired(expiresAt);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja desconectar esta conta?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/connections/${id}`, {
        method: 'DELETE',
      });

      if (response.ok && onDelete) {
        onDelete(id);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting connection:', error);
      alert('Erro ao desconectar. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Conexão Facebook</h3>
              {expired ? (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 mt-1">
                  Expirado
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 mt-1">
                  Ativo
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-medium text-slate-500 mb-1">Facebook User ID</div>
              <div className="text-slate-900 font-mono text-xs">{fbUserId}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-medium text-slate-500 mb-1">Business Managers</div>
              <div className="text-slate-900 font-semibold">{Array.isArray(businessIds) ? businessIds.length : 0}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-medium text-slate-500 mb-1">Contas de Anúncio</div>
              <div className="text-slate-900 font-semibold">{Array.isArray(adAccountIds) ? adAccountIds.length : 0}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-medium text-slate-500 mb-1">Expira em</div>
              <div className="text-slate-900 text-xs">{formatDate(expiresAt)}</div>
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 border border-red-200"
          >
            {deleting ? 'Desconectando...' : 'Desconectar'}
          </button>
        )}
      </div>
    </div>
  );
}
