'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { BriefEdition } from '@/types/briefing';
import { mockEditions } from '@/data/mockBriefings';

export function useBriefings() {
  const [editions, setEditions] = useState<BriefEdition[]>(mockEditions);
  const [selectedEditionId, setSelectedEditionId] = useState<string>(mockEditions[0]?.id || '');
  const [currentEdition, setCurrentEdition] = useState<BriefEdition>(mockEditions[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch specific edition details
  const fetchEditionDetails = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/briefings/${id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: BriefEdition = await res.json();
      setCurrentEdition(data);
      setError(null);
    } catch (_) {
      // Fallback to local mock data if offline or error
      const fallback = mockEditions.find(e => e.id === id) || mockEditions[0];
      setCurrentEdition(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch list of available editions on mount
  useEffect(() => {
    let isMounted = true;

    async function loadEditions() {
      try {
        const res = await fetch('/api/briefings');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const summaries = await res.json();
        
        if (isMounted && Array.isArray(summaries) && summaries.length > 0) {
          // If server returned valid list, map basic info and preserve mock if needed
          const serverEditions = summaries.map((s: any) => {
            const existing = mockEditions.find(m => m.id === s.id);
            if (existing) return existing;
            return {
              id: s.id,
              schemaVersion: 1,
              status: s.status || 'approved',
              meta: {
                title: s.title,
                subtitle: '',
                editionDate: s.editionDate,
                dataAsOf: s.dataAsOf,
              },
              featuredId: '',
              signals: [],
            } as BriefEdition;
          });
          setEditions(serverEditions);
        }
      } catch (_) {
        // Fallback: keep mockEditions
      }
    }

    loadEditions();
    return () => { isMounted = false; };
  }, []);

  // When selectedEditionId changes, load its data
  useEffect(() => {
    if (selectedEditionId) {
      fetchEditionDetails(selectedEditionId);
    }
  }, [selectedEditionId, fetchEditionDetails]);

  return {
    editions,
    selectedEdition: currentEdition,
    selectedEditionId,
    setSelectedEditionId,
    isLoading,
    error,
    refetch: () => fetchEditionDetails(selectedEditionId),
  };
}
