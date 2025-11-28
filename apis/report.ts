import { supabase } from './supabaseClient';

export async function report(
  targetType: 'user' | 'feed' | 'comment' | 'club',
  targetId: string,
  reason: string | null,
) {
  const { error } = await supabase.from('report').insert({
    target_type: targetType,
    target_id: targetId,
    reason,
  });

  if (error) throw error;
}
