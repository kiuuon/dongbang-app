import { UserType } from '@/types/UserType';
import shuffleArray from '@/utils/shuffleArray';
import { supabase } from './supabaseClient';

export async function fetchUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error && error.status !== 400) {
    throw error;
  }

  if (!data?.user) return '';

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
  const { error } = await supabase.from('User').insert([body]);

  if (error) {
    throw error;
  }
}

export async function fetchUniversityList() {
  const { data, error } = await supabase.from('University').select('*');

  if (error) {
    throw error;
  }

  return data;
}

export async function blockUser(userId: string) {
  const { error } = await supabase.rpc('block_user', {
    p_blocked_id: userId,
  });

  if (error) throw error;
}

function sortMentionUsers(keyword: string, users: { name: string; nickname: string; avatar: string }[]) {
  const lower = keyword.toLowerCase();

  const nicknameStarts: { name: string; nickname: string; avatar: string }[] = [];
  const nicknameIncludes: { name: string; nickname: string; avatar: string }[] = [];
  const nameStarts: { name: string; nickname: string; avatar: string }[] = [];
  const nameIncludes: { name: string; nickname: string; avatar: string }[] = [];

  users.forEach((user) => {
    const nk = user.nickname.toLowerCase();
    const nm = user.name.toLowerCase();

    if (nk.startsWith(lower)) nicknameStarts.push(user);
    else if (nk.includes(lower)) nicknameIncludes.push(user);
    else if (nm.startsWith(lower)) nameStarts.push(user);
    else if (nm.includes(lower)) nameIncludes.push(user);
  });

  shuffleArray(nameStarts);
  shuffleArray(nameIncludes);

  return [...nicknameStarts, ...nicknameIncludes, ...nameStarts, ...nameIncludes];
}

export async function fetchUserListByNicknames(nicknames: string[]) {
  const { data, error } = await supabase.from('User').select('id, nickname, name').in('nickname', nicknames);

  if (error) throw error;

  return data;
}

export async function fetchUserListByMention(keyword: string) {
  if (!keyword.trim()) return [];

  const { data, error } = await supabase.rpc('search_mention_users', {
    p_keyword: keyword,
  });

  if (error) throw error;

  return sortMentionUsers(keyword, data).slice(0, 4);
}
