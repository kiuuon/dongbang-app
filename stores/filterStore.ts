/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';

type RecruitmentStatus = 'open' | 'closed' | 'always';
type ClubType = 'campus' | 'union';
type EndDateOption = 'D-Day' | '7일 이내' | '15일 이내' | '30일 이내' | '장기 모집' | null;
type DuesOption = '0원 ~ 5만원' | '5만원 ~ 10만원' | '10만원 이상' | null;

export type FilterType = {
  keyword?: string;
  clubType?: ClubType | null;
  universityName?: string | null;
  detailTypes?: string[];
  location?: string | null;
  categories?: string[];
  recruitmentStatuses?: RecruitmentStatus[];
  endDateOption?: EndDateOption;
  duesOption?: DuesOption;
  meeting?: string | null;
};

const DEFAULT_FILTERS: FilterType = {
  clubType: null,
  universityName: null,
  detailTypes: [],
  location: null,
  categories: [],
  recruitmentStatuses: [],
  endDateOption: null,
  meeting: null,
  duesOption: null,
};

type FiltersStore = {
  filters: FilterType;
  patch: <K extends keyof FilterType>(key: K, value: FilterType[K]) => void;
  toggle: (key: keyof FilterType, value: any) => void;
  draftFilters: FilterType;
  draftPatch: <K extends keyof FilterType>(key: K, value: FilterType[K]) => void;
  draftToggle: (key: keyof FilterType, value: any) => void;
  reset: () => void;
  apply: () => void;
  discard: () => void;
};

const filtersStore = create<FiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  patch: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  toggle: (key, value) =>
    set((state) => {
      if (value === '__CLEAR__') {
        return { filters: { ...state.filters, [key]: [] } };
      }

      const arr = new Set(state.filters[key] ?? []);

      if (arr.has(value)) {
        arr.delete(value);
      } else {
        arr.add(value);
      }

      return { filters: { ...state.filters, [key]: Array.from(arr) as any } };
    }),
  draftFilters: DEFAULT_FILTERS,
  draftPatch: (key, value) => set((state) => ({ draftFilters: { ...state.draftFilters, [key]: value } })),
  draftToggle: (key, value) =>
    set((state) => {
      if (value === '__CLEAR__') {
        return { draftFilters: { ...state.draftFilters, [key]: [] } };
      }

      const arr = new Set(state.draftFilters[key] ?? []);

      if (arr.has(value)) {
        arr.delete(value);
      } else {
        arr.add(value);
      }

      return { draftFilters: { ...state.draftFilters, [key]: Array.from(arr) as any } };
    }),
  reset: () => set({ draftFilters: DEFAULT_FILTERS }),
  apply: () => set((state) => ({ filters: state.draftFilters })),
  discard: () => set((state) => ({ draftFilters: state.filters })),
}));

export default filtersStore;
