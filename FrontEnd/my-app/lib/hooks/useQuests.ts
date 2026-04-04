'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { getQuests } from '@/lib/api/quests';
import type { QuestFilters, PaginationParams } from '@/lib/types/quest';

export function useQuests(
  filters?: QuestFilters,
  pagination?: PaginationParams,
) {
  const quests           = useStore((s) => s.quests);
  const questsLoading    = useStore((s) => s.questsLoading);
  const questsError      = useStore((s) => s.questsError);
  const paginationData   = useStore((s) => s.pagination);
  const setQuests        = useStore((s) => s.setQuests);
  const setQuestsLoading = useStore((s) => s.setQuestsLoading);
  const setQuestsError   = useStore((s) => s.setQuestsError);
  const setPagination    = useStore((s) => s.setQuestPagination);
  const setFilters       = useStore((s) => s.setQuestFilters);

  const fetchQuests = useCallback(async () => {
    try {
      setQuestsLoading(true);
      setQuestsError(null);

      const response = await getQuests(filters, pagination);
      setQuests(response.data);
      setPagination({
        page:       response.pagination.page       ?? 1,
        limit:      response.pagination.limit      ?? 12,
        total:      response.pagination.total      ?? 0,
        totalPages: response.pagination.totalPages ?? 0,
        hasMore:    response.pagination.hasMore    ?? false,
      });
    } catch (err) {
      setQuestsError(err instanceof Error ? err.message : 'Failed to fetch quests');
      setQuests([]);
    } finally {
      setQuestsLoading(false);
    }
  }, [JSON.stringify(filters), JSON.stringify(pagination)]);

  useEffect(() => {
    if (filters) setFilters(filters);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return {
    quests,
    isLoading:  questsLoading,
    error:      questsError ? new Error(questsError) : null,
    pagination: paginationData,
    refetch:    fetchQuests,
  };
}