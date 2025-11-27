import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';

export default async function AdminConnectionsPage() {
  await requireAdmin();
  // Redirect to main admin page (connections are shown there)
  redirect('/admin');
}

