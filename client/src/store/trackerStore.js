import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const useTrackerStore = create(
  persist(
    (set, get) => ({
      sessionId: generateSessionId(),
      savedSchemeIds: [],
      boards: {
        'My Applications': [],
        'Family Schemes': [],
      },
      applications: [], // { schemeId, status, notes, updatedAt }
      telegramChatId: null,

      toggleSaveScheme: (schemeId, boardName = 'My Applications') => {
        const { savedSchemeIds, boards } = get();
        const isSaved = savedSchemeIds.includes(schemeId);
        if (isSaved) {
          const nextSaved = savedSchemeIds.filter((id) => id !== schemeId);
          const nextBoards = { ...boards };
          for (const b in nextBoards) {
            nextBoards[b] = nextBoards[b].filter((id) => id !== schemeId);
          }
          set({ savedSchemeIds: nextSaved, boards: nextBoards });
        } else {
          const currentBoardList = boards[boardName] || [];
          set({
            savedSchemeIds: [...savedSchemeIds, schemeId],
            boards: {
              ...boards,
              [boardName]: [...currentBoardList, schemeId],
            },
          });
        }
      },

      updateApplicationStatus: (schemeId, status, notes = '') => {
        const { applications } = get();
        const existing = applications.find((a) => a.schemeId === schemeId);
        if (existing) {
          set({
            applications: applications.map((a) =>
              a.schemeId === schemeId ? { ...a, status, notes, updatedAt: new Date().toISOString() } : a
            ),
          });
        } else {
          set({
            applications: [
              ...applications,
              { schemeId, status, notes, updatedAt: new Date().toISOString() },
            ],
          });
        }
      },

      setTelegramChatId: (chatId) => set({ telegramChatId: chatId }),
    }),
    {
      name: 'scheme_saathi_tracker_store',
    }
  )
);
