import { create } from 'zustand';

export const useUIStore = create((set) => ({
  darkMode: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: next };
    }),
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  activeSchemeModal: null,
  setActiveSchemeModal: (scheme) => set({ activeSchemeModal: scheme }),
}));
