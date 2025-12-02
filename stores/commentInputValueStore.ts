import { create } from 'zustand';

const commentInputValue = create<{
  value: string;
  setValue: (value: string) => void;
}>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));

export default commentInputValue;
