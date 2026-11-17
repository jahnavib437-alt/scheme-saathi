import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const initialProfile = {
  age: null,
  gender: null,
  state: 'Karnataka',
  district: 'Tumakuru',
  areaType: null,
  occupation: null,
  annualIncome: null,
  socialCategory: null,
  maritalStatus: null,
  isStudent: null,
  educationLevel: null,
  landHoldingAcres: null,
  hasDisability: null,
  disabilityPercent: null,
  hasBplCard: null,
  familySize: null,
  isPregnant: null,
  childrenAges: [],
  isMinority: null,
};

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profile: { ...initialProfile },
      setField: (field, value) =>
        set((state) => ({
          profile: { ...state.profile, [field]: value },
        })),
      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),
      resetProfile: () => set({ profile: { ...initialProfile } }),
      getActivePins: () => {
        const { profile } = get();
        return Object.entries(profile).filter(
          ([key, val]) => val !== null && val !== undefined && !(Array.isArray(val) && val.length === 0)
        );
      },
    }),
    {
      name: 'scheme_saathi_citizen_profile',
    }
  )
);
