import { create } from 'zustand';

interface ClubInfoStoreType {
  campusClubType?: string | undefined;
  setCampusClubType: (campusClubType: string | undefined) => void;
  name: string;
  setName: (name: string) => void;
  category: string;
  setCategory: (category: string) => void;
  location: string | undefined;
  setLocation: (location: string | undefined) => void;
  bio: string;
  setBio: (bio: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}

const clubInfoStore = create<ClubInfoStoreType>((set) => ({
  campusClubType: undefined,
  setCampusClubType: (campusClubType) => set({ campusClubType }),
  name: '',
  setName: (name) => set({ name }),
  category: '',
  setCategory: (category) => set({ category }),
  location: '',
  setLocation: (location) => set({ location }),
  bio: '',
  setBio: (bio) => set({ bio }),
  description: '',
  setDescription: (description) => set({ description }),
  tags: [],
  setTags: (tags) => set({ tags }),
}));

export default clubInfoStore;
