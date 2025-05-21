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
