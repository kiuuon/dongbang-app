export interface UserType {
  id: string;
  name: string;
  birth: string;
  gender: string;
  email: string;
  nickname: string;
  university_id: number;
  major: string;
  clubs_joined: string;
  join_path: string | null;
  term_of_use: boolean;
  privacy_policy: boolean;
  third_party_consent: boolean;
  marketing: boolean;
}
