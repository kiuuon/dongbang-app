import { UserType } from '@/types/UserType';
import { supabase } from './supabaseClient';

export async function fetchUserId() {
  const { data } = await supabase.auth.getUser();

  return data?.user?.id;
}

export async function fetchUser() {
  const userId = await fetchUserId();

  const { data } = await supabase.from('User').select('*, University(name)').eq('id', userId);

  if (!data) {
    return null;
  }

  return data[0];
}

export async function signUp(body: UserType) {
  await supabase.from('User').insert([body]);
}
