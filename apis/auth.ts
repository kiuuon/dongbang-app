import { supabase } from './supabaseClient';

export async function fetchSession() {
  const { data } = await supabase.auth.getSession();

  return data?.session;
}

export async function fetchUserId() {
  const { data } = await supabase.auth.getUser();

  return data?.user?.id;
}

export async function login(accessToken: string, refreshToken: string) {
  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

export async function logout() {
  await supabase.auth.signOut();
}
