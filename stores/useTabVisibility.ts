import { create } from 'zustand';

const useTabVisibility = create<{
  hidden: boolean;
  hide: () => void;
  show: () => void;
}>((set) => ({
  hidden: false,
  hide: () => set({ hidden: true }),
  show: () => set({ hidden: false }),
}));

export default useTabVisibility;
