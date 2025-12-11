import { supabase } from './supabaseClient';
import { fetchUserId } from './user';

export async function fetchSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error && error.status !== 400) {
    throw error;
  }

  return data?.session;
}

export async function login(accessToken: string, refreshToken: string) {
  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

export async function logout() {
  const userId = await fetchUserId();

  if (!userId) return;

  const { error } = await supabase.from('user_push_tokens').update({ is_active: false }).eq('user_id', userId);

  if (error) throw error;

  await supabase.auth.signOut();
}
