import { supabase } from './supabaseClient';

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
  await supabase.auth.signOut();
}
