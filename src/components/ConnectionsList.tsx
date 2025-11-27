'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectionCard } from './ConnectionCard';

interface Connection {
  id: string;
  fbUserId: string;
  businessIds: string[] | number[];
  adAccountIds: string[] | number[];
  expiresAt: Date | string | null;
  dataAccessExpiresAt: Date | string | null;
  createdAt: Date | string;
}

export function ConnectionsList({
  initialConnections,
}: {
  initialConnections: Connection[];
}) {
  const [connections, setConnections] = useState(initialConnections);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setConnections(connections.filter((conn) => conn.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {connections.map((conn) => (
        <ConnectionCard
          key={conn.id}
          id={conn.id}
          fbUserId={conn.fbUserId}
          businessIds={conn.businessIds as string[]}
          adAccountIds={conn.adAccountIds as string[]}
          expiresAt={conn.expiresAt}
          dataAccessExpiresAt={conn.dataAccessExpiresAt}
          createdAt={conn.createdAt}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

