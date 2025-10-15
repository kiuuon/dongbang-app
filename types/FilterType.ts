type RecruitmentStatus = 'open' | 'closed' | 'always';
type ClubType = 'campus' | 'union';
type EndDateOption = 'D-Day' | '7일 이내' | '15일 이내' | '30일 이내' | '장기 모집' | null;
type DuesOption = '0원 ~ 5만원' | '5만원 ~ 10만원' | '10만원 이상' | null;

export interface FilterType {
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
}
