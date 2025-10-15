export interface FeedType {
  id: string;
  author_id: string;
  author: {
    name: string;
    avatar: string;
    role: string | null;
  };
  club_id: string;
  club: {
    name: string;
    logo: string;
  };
  club_type: 'campus' | 'union';
  photos: string[];
  title: string;
  content: string;
  is_nickname_visible: boolean;
  is_private: boolean;
  taggedUsers: {
    user: {
      name: string;
      avatar: string;
    };
  }[];
  taggedClubs: {
    club: {
      name: string;
      logo: string;
    };
  }[];
  created_at: string;
}
