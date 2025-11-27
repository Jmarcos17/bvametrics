'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  email: string | null;
  token: string;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  connections: Array<{
    id: string;
    fbUserId: string;
    expiresAt: Date | string | null;
    createdAt: Date | string;
  }>;
}

export function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newClient = await response.json();
        setClients([newClient, ...clients]);
        setFormData({ name: '', email: '' });
        setShowForm(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(
          errorData.details
            ? `Erro: ${JSON.stringify(errorData.details)}`
            : 'Erro ao criar cliente'
        );
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Erro ao criar cliente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (response.ok) {
        fetchClients();
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(clients.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const getConnectionLink = (token: string) => {
    return `${window.location.origin}/connect/${token}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado para a área de transferência!');
  };

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Clientes ({clients.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:scale-[1.02]"
        >
          {showForm ? 'Cancelar' : '+ Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Novo Cliente</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Nome do cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email (opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="email@exemplo.com"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all transform hover:scale-[1.02] disabled:transform-none"
            >
              {submitting ? 'Criando...' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                Link de Conexão
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                Conexões
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                Criado em
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                Ações
              </th>
            </tr>
          </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {clients.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                  Nenhum cliente cadastrado
                </td>
              </tr>
            ) : (
              clients.map((client) => {
                const link = getConnectionLink(client.token);
                return (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {client.name}
                      </div>
                      {client.email && (
                        <div className="text-sm text-slate-500">
                          {client.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={link}
                          className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs text-slate-600"
                        />
                        <button
                          onClick={() => copyToClipboard(link)}
                          className="rounded-lg bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                        {client.connections?.length || 0}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(client.id, client.active)}
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          client.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {client.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

