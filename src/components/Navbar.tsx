'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Meta Ads Platform
            </Link>
            {session && (
              <div className="hidden space-x-2 md:flex">
                <Link
                  href="/dashboard"
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                    pathname === '/dashboard'
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                        pathname === '/admin'
                          ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      Admin
                    </Link>
                    <Link
                      href="/admin/clients"
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                        pathname === '/admin/clients'
                          ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      Clientes
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
