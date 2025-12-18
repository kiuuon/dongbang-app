import { ClubType } from '@/types/ClubType';
import { FilterType } from '@/stores/filterStore';
import { supabase } from './supabaseClient';
import { fetchUserId } from './user';

export async function fetchClubsCount(keyword: string, filters: FilterType) {
  const { data, error } = await supabase.rpc('count_clubs_detailed', {
    p_keyword: keyword ?? '',
    p_club_type: filters.clubType ?? null,
    p_university_name: filters.universityName ?? null,
    p_detail_types: filters.detailTypes ?? [],
    p_location: filters.location ?? null,
    p_categories: filters.categories ?? [],
  });
  if (error) throw error;

  return data ?? 0;
}

export async function fetchClubs(keyword: string, filters: FilterType, page: number) {
  const PAGE_SIZE = 10;

  const { data, error } = await supabase.rpc('search_clubs_detailed', {
    p_keyword: keyword ?? '',
    p_club_type: filters.clubType ?? null,
    p_university_name: filters.universityName ?? null,
    p_detail_types: filters.detailTypes ?? [],
    p_location: filters.location ?? null,
    p_categories: filters.categories ?? [],
    p_limit_count: PAGE_SIZE,
    p_offset_count: page * PAGE_SIZE,
  });

  if (error) throw error;

  return data ?? [];
}

export async function fetchAllClubs() {
  const { data: clubs, error } = await supabase.from('Clu').select('*');

  if (error) {
    throw error;
  }

  return clubs;
}

export async function createClub(body: ClubType) {
  const userId = await fetchUserId();
  let universityId: number | null = null;

  if (body.type === 'campus') {
    const { data, error } = await supabase.from('User').select('university_id').eq('id', userId).single();
    if (error) {
      throw error;
    }
    universityId = data?.university_id;
  }

  const { error } = await supabase.rpc('create_club_with_recruitment_transaction', {
    club: {
      name: body.name,
      type: body.type, // 'campus' | 'union'
      description: body.description,
      bio: body.bio,
      detail_type: body.detail_type,
      location: body.location,
      logo: body.logo,
      background: body.background,
      tags: body.tags,
      category: body.category,
      university_id: universityId,
      creator_id: userId,
    },
  });

  if (error) {
    throw error;
  }
}

export async function editClubInfo(body: ClubType, clubId: string) {
  const { error } = await supabase.from('Club').update([body]).eq('id', clubId);

  if (error) throw error;
}

export async function fetchMyClubs() {
  const userId = await fetchUserId();
  const { data: clubData, error: fetchClubDataError } = await supabase
    .from('Club_User')
    .select('club_id')
    .eq('user_id', userId);

  if (fetchClubDataError) {
    throw fetchClubDataError;
  }

  const clubIds = clubData?.map((club) => club.club_id) || [];

  const { data: clubs, error: fetchClubsError } = await supabase.from('Club').select('*').in('id', clubIds);

  if (fetchClubsError) {
    throw fetchClubsError;
  }

  return clubs;
}

export async function fetchClubsByUserNickname(nickname: string) {
  const { data, error } = await supabase.rpc('get_clubs_by_user_nickname', {
    p_nickname: nickname,
  });

  if (error) throw error;

  return data;
}

export async function fetchClubMembers(clubId: string) {
  const { data, error } = (await supabase
    .from('Club_User')
    .select('user_id, User(name, avatar, nickname, deleted_at), role')
    .eq('club_id', clubId)) as unknown as {
    data: {
      user_id: string;
      role: string;
      User: { name: string; avatar: string; nickname: string; deleted_at: string | null } | null;
    }[];
    error: Error | null;
  };

  if (error) {
    throw error;
  }

  return data?.map((member) => ({
    userId: member.user_id,
    name: member.User?.name,
    nickname: member.User?.nickname,
    avatar: member.User?.avatar,
    role: member.role,
    deletedAt: member.User?.deleted_at,
  }));
}

export async function leaveClub(clubId: string) {
  const { error } = await supabase.rpc('leave_club', {
    p_club_id: clubId,
  });

  if (error) {
    throw error;
  }
}

export async function checkIsClubMember(clubId: string) {
  const userId = await fetchUserId();

  if (!userId) return false;

  const { data, error } = await supabase
    .from('Club_User')
    .select('club_id')
    .eq('club_id', clubId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function fetchMyRole(clubId: string) {
  const userId = await fetchUserId();

  if (!userId) return null;

  const { data, error } = await supabase
    .from('Club_User')
    .select('role')
    .eq('user_id', userId)
    .eq('club_id', clubId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return data?.role;
}
