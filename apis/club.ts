import { ClubType } from '@/types/ClubType';
import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function createClub(body: ClubType) {
  const userId = await fetchUserId();
  let universityId: number | null = null;

  if (body.type === 'campus') {
    const { data } = await supabase.from('User').select('university_id').eq('id', userId).single();
    universityId = data?.university_id;
  }

  const newBody = {
    ...body,
    university_id: universityId,
    creator_id: userId,
  };

  const { data } = await supabase.from('Club').insert([newBody]).select();

  const clubId = data?.[0]?.id;

  await supabase.from('Club_User').insert([
    {
      user_id: userId,
      club_id: clubId,
      role: 'president',
    },
  ]);
}

export async function fetchMyClubs() {
  const userId = await fetchUserId();
  const { data: clubData } = await supabase.from('Club_User').select('club_id').eq('user_id', userId);

  const clubIds = clubData?.map((club) => club.club_id) || [];

  const { data: clubs } = await supabase.from('Club').select('*').in('id', clubIds);

  return clubs;
}
