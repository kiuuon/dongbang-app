export interface ClubType {
  id: string;
  type: string;
  name: string;
  category: string;
  location: string | undefined;
  description: string;
  tags: string[];
  logo: string;
  activity_photos: string[];
  detail_description: string;
  detail_type: string | null;
  recruitment?: {
    recruitment_status: string;
    end_date: string | null;
  }[];
}
