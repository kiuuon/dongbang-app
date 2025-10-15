import { create } from 'zustand';

interface ExploreStoreType {
  searchTarget: 'feed' | 'club' | 'hashtag';
  setSearchTarget: (searchTarget: 'feed' | 'club' | 'hashtag') => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  selectedHashtag: string;
  setSelectedHashtag: (selectedHashtag: string) => void;
}

const exploreStore = create<ExploreStoreType>((set) => ({
  searchTarget: 'feed',
  setSearchTarget: (searchTarget) => set({ searchTarget }),
  keyword: '',
  setKeyword: (keyword) => set({ keyword }),
  selectedHashtag: '',
  setSelectedHashtag: (selectedHashtag) => set({ selectedHashtag }),
}));

export default exploreStore;
