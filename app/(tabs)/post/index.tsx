import { Text, TouchableOpacity, SafeAreaView } from 'react-native';

import { supabase } from '@/apis/supabaseClient';

function PostScreen() {
  return (
    <SafeAreaView>
      <Text>post</Text>
      <TouchableOpacity
        onPress={async () => {
          await supabase.auth.signOut();
        }}
      >
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default PostScreen;
