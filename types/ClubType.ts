export interface ClubType {
  id: string;
  type: string;
  name: string;
  category: string;
  location: string | undefined;
  description: string;
  tags: string[];
  logo: string;
  background?: string | null;
  bio: string;
  detail_type: string | null;
  recruitment?: {
    recruitment_status: string;
    end_date: string | null;
  }[];
}
